export interface IConfig {
  http: {
    port: number;
  };
  db: {
    host:     string;
    port:     number;
    user:     string;
    password: string;
    database: string;
  };
}

export interface INow {
  ts: string;
}

export interface IProfile {
  id: number;
  name: string;
  email: string;
}

export interface DbResult<T> {
  data: T[] | null;
  error: string | null;
}
