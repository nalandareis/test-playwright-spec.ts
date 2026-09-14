import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Etapa 1 (sequencial): loga como gestor e cria N usuários autorizados,
 * gerando o código de acesso de cada um. Os dados são salvos em
 * users.json para a etapa 2 (carga concorrente) consumir.
 *
 * Rode sozinho: npx playwright test tests/load/setup-users.spec.ts --workers=1
 */

const QUANTIDADE_USUARIOS = Number(process.env.QTD_USUARIOS ?? 20);
const OUTPUT_PATH = path.join(__dirname, 'users.json');

test('gera usuários autorizados e coleta códigos de acesso', async ({ page }) => {
  test.setTimeout(QUANTIDADE_USUARIOS * 20_000);

  await page.goto('https://atividades.neuroverse.com.br/login');
  await page.getByRole('textbox', { name: 'Nome' }).fill('Bruno Gestor');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill('gestor123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByRole('link', { name: 'Usuários' }).click();

  const usuarios: { nome: string; codigo: string }[] = [];

  for (let i = 0; i < QUANTIDADE_USUARIOS; i++) {
    const nome = `carga_teste_${Date.now()}_${i}`;

    await page.getByRole('button', { name: 'Novo autorizado' }).click();
    await page.getByRole('textbox', { name: 'Nome' }).click();
    await page.getByRole('textbox', { name: 'Nome' }).fill(nome);
    await page.getByLabel('Papel', { exact: true }).selectOption('QA');
    await page.getByRole('button', { name: 'Autorizar' }).click();

    const botoes = page.getByRole('button', { name: 'Gerar código' });
    await botoes.last().waitFor({ state: 'visible' });

    // Overlay residual do select "Papel" intercepta o clique; fecha antes de continuar.
    await page.keyboard.press('Escape');
    await page.locator('body').click({ position: { x: 0, y: 0 } });

    await botoes.last().scrollIntoViewIfNeeded();
    await botoes.last().click();

    const codigoLocator = page.getByText(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/);
    await codigoLocator.waitFor({ state: 'visible' });
    const codigo = (await codigoLocator.textContent())?.trim();
    expect(codigo, `código de acesso não encontrado para ${nome}`).toBeTruthy();

    usuarios.push({ nome, codigo: codigo! });

    await page.getByText('Fechar').click();
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(usuarios, null, 2));
  console.log(`Salvos ${usuarios.length} usuários em ${OUTPUT_PATH}`);
});
