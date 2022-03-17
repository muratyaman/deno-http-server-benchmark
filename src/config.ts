import { IConfig } from './types.ts';

export function makeConfig(): IConfig {
  const conf = {
    http: {
      port: Number.parseInt(Deno.env.get('HTTP_PORT') ?? '8000'),
    },
    db: {
      host:     Deno.env.get('PGHOST') ?? 'localhost',
      port:     Number.parseInt(Deno.env.get('PGPORT') ?? '5432'),
      user:     Deno.env.get('PGUSER') ?? '',
      password: Deno.env.get('PGPASSWORD') ?? '',
      database: Deno.env.get('PGDATABASE') ?? '',
    },
  };
  return conf;
}
