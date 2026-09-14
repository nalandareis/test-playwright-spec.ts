import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Etapa 2b (concorrente): simula N usuários já com senha definida
 * fazendo login ao mesmo tempo, cada um em seu próprio browser context.
 *
 * Pré-requisito: os usuários de users.json já passaram pelo
 * concurrent-create-accounts.spec.ts (senha 'senha123' definida).
 * obs: é preciso que o qa tenha uma senha e e-mail para entrar na plataforma e simular o teste
 * Rode com múltiplos workers para simular carga real, ex:
 *   npx playwright test tests/load/concurrent-login.spec.ts --workers=30 ou apenas o comando padrão
 */

const USERS_PATH = path.join(__dirname, 'users.json');
const SENHA = 'senha123';

let usuarios: { nome: string; codigo: string }[] = [];
if (fs.existsSync(USERS_PATH)) {
  usuarios = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
} else {
  console.warn(`Arquivo ${USERS_PATH} não encontrado. Rode setup-users.spec.ts antes.`);
}

test.describe.parallel('login concorrente', () => {
  for (const usuario of usuarios) {
    test(`login - ${usuario.nome}`, async ({ page }) => {
      await page.goto('https://atividades.neuroverse.com.br/login');
      await page.getByRole('textbox', { name: 'Nome' }).fill(usuario.nome);
      await page.getByRole('button', { name: 'Continuar' }).click();
      await page.getByRole('textbox', { name: 'Senha' }).fill(SENHA);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await page.goto('https://atividades.neuroverse.com.br/');
    });
  }
});
