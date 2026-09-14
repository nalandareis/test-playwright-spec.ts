import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Etapa 2a (concorrente): simula N usuários fazendo "primeiro acesso"
 * (definindo senha) ao mesmo tempo, cada um em seu próprio browser context.
 *
 * Requer tests/load/users.json gerado por setup-users.spec.ts.
 *
 * Rode com múltiplos workers para simular carga real, ex:
 *   npx playwright test tests/load/concurrent-create-accounts.spec.ts --workers=30 ou só rodando o comando padrão de npx playwright test tests vai rodar todos os testes que estiverem dentro da pasta tests rodando 20 usuarios ao mesmo tempo
 */

const USERS_PATH = path.join(__dirname, 'users.json');
const SENHA = 'senha123';

let usuarios: { nome: string; codigo: string }[] = [];
if (fs.existsSync(USERS_PATH)) {
  usuarios = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
} else {
  console.warn(`Arquivo ${USERS_PATH} não encontrado. Rode setup-users.spec.ts antes.`);
}

test.describe.parallel('criação de conta concorrente', () => {
  for (const usuario of usuarios) {
    test(`primeiro acesso - ${usuario.nome}`, async ({ page }) => {
      await page.goto('https://atividades.neuroverse.com.br/login');
      await page.getByRole('textbox', { name: 'Nome' }).fill(usuario.nome);
      await page.getByRole('button', { name: 'Continuar' }).click();
      await page.getByRole('button', { name: 'Primeiro acesso ou esqueci a' }).click();
      await page.getByRole('textbox', { name: 'Código de acesso' }).fill(usuario.codigo);
      await page.getByRole('textbox', { name: 'Nova senha' }).click();
      await page.getByRole('textbox', { name: 'Nova senha' }).fill(SENHA);
      await page.getByRole('textbox', { name: 'Repetir senha' }).click();
      await page.getByRole('textbox', { name: 'Repetir senha' }).fill(SENHA);
      await page.getByRole('button', { name: 'Definir senha e entrar' }).click();
      await page.goto('https://atividades.neuroverse.com.br/');
    });
  }
});
