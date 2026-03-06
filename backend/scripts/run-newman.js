const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const collectionFile = path.join(projectRoot, 'tests', 'postman', 'DeepResearchBackend.postman_collection.json');
const environmentFile = path.join(projectRoot, 'tests', 'postman', 'DeepResearchBackend.local.postman_environment.json');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(baseUrl, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  const healthUrl = `${baseUrl}/api/health`;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }
    await wait(500);
  }

  throw new Error(`Timeout waiting for health endpoint: ${healthUrl}`);
}

function spawnServer(port) {
  const child = spawn(process.execPath, ['src/index.js'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[server] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[server] ${chunk}`));

  return child;
}

function runNewman({ baseUrl, email, name, updatedName, password, query, ciMode }) {
  const newmanBin = require.resolve('newman/bin/newman.js');
  const args = [
    newmanBin,
    'run',
    collectionFile,
    '-e',
    environmentFile,
    '--bail',
    '--color',
    ciMode ? 'off' : 'on',
    '--env-var',
    `baseUrl=${baseUrl}`,
    '--env-var',
    `email=${email}`,
    '--env-var',
    `password=${password}`,
    '--env-var',
    `name=${name}`,
    '--env-var',
    `updatedName=${updatedName}`,
    '--env-var',
    `query=${query}`,
  ];

  if (ciMode) {
    args.push('--reporters', 'cli,junit');
    args.push(
      '--reporter-junit-export',
      path.join(projectRoot, 'tests', 'reports', 'newman-results.xml'),
    );
  }

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}

async function main() {
  const ciMode = process.argv.includes('--ci');
  const port = Number(process.env.TEST_API_PORT || process.env.PORT || 3001);
  const baseUrl = process.env.BASE_URL || `http://127.0.0.1:${port}`;

  const nonce = Date.now();
  const email = process.env.TEST_EMAIL || `newman_user_${nonce}@example.com`;
  const password = process.env.TEST_PASSWORD || 'password123';
  const name = process.env.TEST_NAME || 'Newman User';
  const updatedName = process.env.TEST_UPDATED_NAME || 'Updated Newman User';
  const query = process.env.TEST_QUERY || 'research assistant';

  if (ciMode) {
    const fs = require('fs');
    const reportsDir = path.join(projectRoot, 'tests', 'reports');
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const server = spawnServer(port);

  const stopServer = () => {
    if (!server.killed) {
      server.kill();
    }
  };

  process.on('SIGINT', () => {
    stopServer();
    process.exit(130);
  });

  process.on('SIGTERM', () => {
    stopServer();
    process.exit(143);
  });

  try {
    await waitForHealth(baseUrl, 30000);
    const code = await runNewman({ baseUrl, email, name, updatedName, password, query, ciMode });
    stopServer();
    process.exit(code);
  } catch (error) {
    stopServer();
    console.error('[test:api] Failed:', error.message || error);
    process.exit(1);
  }
}

main();
