// Garante que src/environments/supabase.config.ts exista antes de serve/build.
// O arquivo real é ignorado pelo Git; o exemplo versionado só contém valores públicos.
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'src', 'environments', 'supabase.config.ts');
const example = join(root, 'src', 'environments', 'supabase.config.example.ts');

if (!existsSync(target)) {
  copyFileSync(example, target);
  console.log('[ensure-env] Criado src/environments/supabase.config.ts a partir do exemplo.');
  console.log('[ensure-env] Preencha publishableKey (sb_publishable_...) para habilitar login e dados.');
}
