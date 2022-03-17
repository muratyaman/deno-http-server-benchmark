import { PgPool } from '../deps.ts';
import { DbResult, IConfig, INow, IProfile } from './types.ts';

const POOL_CONNECTIONS = 25;
const LAZY_CONNECTIONS = true;

const SELECT_PROFILES = 'SELECT id, name, email FROM public.profile LIMIT 10 OFFSET $OFFSET';

export async function makeServer(config: IConfig) {
  const dbPool = new PgPool(config.db, POOL_CONNECTIONS, LAZY_CONNECTIONS);

  async function dbQuery<T>(text: string, args: any = {}): Promise<DbResult<T>> {
    let data: T[] | null = null, error: string | null = null;
    try {
      const db = await dbPool.connect();
      try {
        const result = await db.queryObject<T>({ text, args });
        data = result.rows as T[];
      } catch (err) {
        console.error('db query error', err.message);
      }
      db.release();
    } catch (err) {
      console.error('db connection error', err.message);
    }
    return { data, error };
  }

  async function httpHandler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    switch (url.pathname) {
      case '/json': return json(req);
      case '/sql1': return sql1(req);
      case '/sql2': return sql2(req);
      case '/text':
      case '/':
      default:
        return text(req);
    }
  }

  function text(req: Request): Response {
    return new Response('Hello world!');
  }

  function json(req: Request): Response {
    const data = JSON.stringify({ message: 'Hello world!', ts: new Date() });
    const res = new Response(data);
    res.headers.set('content-type', 'application/json');
    return res;
  }

  async function sql1(req: Request): Promise<Response> {
    let body = '', error = null, data: INow[] | null = null;
    try {
      body = await req.text();
      const result = await dbQuery<INow>('SELECT now() AS ts');
      data = result.data;
      error = result.error;
    } catch (err) {
      error = err.message;
    }
    const result = {
      message: 'Hello, World!',
      method: req.method,
      url: req.url,
      body,
      data,
      error,
      ts: new Date(),
    };
    return new Response(JSON.stringify(result));
  }

  async function sql2(req: Request): Promise<Response> {
    let body = '', error = null, data: IProfile[] | null = null;
    try {
      body = await req.text();
      const offset = 0 + Math.floor(Math.random() * 200000);
      const result = await dbQuery<IProfile>(SELECT_PROFILES, { offset });
      data = result.data;
      error = result.error;
    } catch (err) {
      error = err.message;
    }
    const result = {
      message: 'Hello, World!',
      method: req.method,
      url: req.url,
      body,
      data,
      error,
      ts: new Date(),
    };
    return new Response(JSON.stringify(result));
  }

  return { dbPool, httpHandler, text, json, sql1, sql2 };
}
