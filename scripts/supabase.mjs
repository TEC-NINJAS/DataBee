// O executável da CLI usa Bun, que também precisa reconhecer as CAs do Windows.
// O arquivo temporário contém apenas certificados públicos já confiáveis no PC.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { getCACertificates } from 'node:tls';

const require = createRequire(import.meta.url);
const cliShim = join(dirname(require.resolve('supabase/package.json')), 'dist', 'supabase.js');
const cliEnvironment = { ...process.env };
let certificateDirectory;
let certificateFile;

try {
  // Preserva uma configuração explícita de CAs feita pelo responsável.
  if (process.platform === 'win32' && !cliEnvironment.SSL_CERT_FILE) {
    const certificates = [...new Set(getCACertificates('system'))];
    if (certificates.length > 0) {
      certificateDirectory = mkdtempSync(join(tmpdir(), 'databee-supabase-ca-'));
      certificateFile = join(certificateDirectory, 'windows-roots.pem');
      writeFileSync(certificateFile, certificates.join('\n'), { mode: 0o600 });
      cliEnvironment.SSL_CERT_FILE = certificateFile;
      cliEnvironment.NODE_EXTRA_CA_CERTS ??= certificateFile;
    }
  }

  const child = spawn(process.execPath, [cliShim, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: cliEnvironment,
  });
  const forwarders = new Map();
  for (const signal of ['SIGINT', 'SIGTERM']) {
    const forward = () => {
      if (child.exitCode === null && child.signalCode === null) child.kill(signal);
    };
    forwarders.set(signal, forward);
    process.on(signal, forward);
  }

  try {
    process.exitCode = await new Promise((resolveExit, rejectExit) => {
      child.once('error', rejectExit);
      child.once('exit', (code, signal) => resolveExit(code ?? (signal === 'SIGINT' ? 130 : 1)));
    });
  } finally {
    for (const [signal, forward] of forwarders) process.removeListener(signal, forward);
  }
} finally {
  // Remove somente os dois caminhos criados nesta execução, sem exclusão recursiva.
  if (certificateFile) unlinkSync(certificateFile);
  if (certificateDirectory) rmdirSync(certificateDirectory);
}
