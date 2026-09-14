import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://atividades.neuroverse.com.br/login');
  await page.getByRole('textbox', { name: 'Nome' }).fill('Bruno Gestor');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill('gestor123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByRole('link', { name: 'Usuários' }).click();
  await page.getByRole('button', { name: 'Novo autorizado' }).click();
  await page.getByRole('textbox', { name: 'Nome' }).click();
  await page.getByRole('textbox', { name: 'Nome' }).fill('teste2automação');
  await page.getByLabel('Papel', { exact: true }).selectOption('QA');
  await page.getByRole('button', { name: 'Autorizar' }).click();

const botoes = page.getByRole('button', { name: 'Gerar código' });


await botoes.last().waitFor({ state: 'visible' });

// O select "Papel" deixa um overlay residual aberto que intercepta o clique;
//solução para o bug do pop up que abre overlay antes de continuar.
await page.keyboard.press('Escape');
await page.locator('body').click({ position: { x: 0, y: 0 } });

await botoes.last().scrollIntoViewIfNeeded();

await botoes.last().click();
  await page.getByRole('button', { name: 'Copiar código' }).click();
  await page.getByText('Fechar').click();
  await page.getByRole('button', { name: 'Sair' }).click();
  await page.getByRole('textbox', { name: 'Nome' }).fill('teste2automação');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Primeiro acesso ou esqueci a' }).click();
  await page.getByRole('textbox', { name: 'Código de acesso' }).fill('3HZ-YM4-BMY');
  await page.getByRole('textbox', { name: 'Nova senha' }).click();
  await page.getByRole('textbox', { name: 'Nova senha' }).fill('senha123');
  await page.getByRole('textbox', { name: 'Repetir senha' }).click();
  await page.getByRole('textbox', { name: 'Repetir senha' }).fill('senha123');
  await page.getByRole('button', { name: 'Definir senha e entrar' }).click();
  await page.goto('https://atividades.neuroverse.com.br/');
});