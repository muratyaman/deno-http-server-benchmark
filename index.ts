import { envConfig, httpServe } from './deps.ts';
import { makeConfig } from './src/config.ts';
import { makeServer } from './src/server.ts';

main();

async function main() {
  await envConfig({ safe: true, allowEmptyValues: false, path: './.env', export: true });
  const config = makeConfig();
  const server = await makeServer(config);
  httpServe(server.httpHandler, config.http);
  console.log(`http://localhost:${config.http.port}`);
}
