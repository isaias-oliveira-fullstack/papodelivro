import dotenv from 'dotenv';
import path from 'path';
import { Dialect } from 'sequelize';

dotenv.config({ path: path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'), override: true });
// Fallback para `.env` caso `.env.production` ou `.env.development` não exista
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

type DatabaseConfig = {
  dialect: Dialect;
  host: string;
  port: number;
  username: string;
  password?: string;
  database: string;
  url?: string;
  storage?: string;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  retry?: {
    max: number;
  };
  define: {
    timestamps: boolean;
    underscored: boolean;
    underscoredAll: boolean;
  };
  logging: boolean;
};

const baseConfig = {
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: false,
};

const isTestEnvironment = process.env.NODE_ENV === 'test' || typeof process.env.JEST_WORKER_ID !== 'undefined';
const useLocalDatabase = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD);
const useSsl = !isTestEnvironment && (Boolean(process.env.DATABASE_URL) || process.env.DB_HOST?.includes('supabase.co') || process.env.DB_SSL === 'true');
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const config: DatabaseConfig = isTestEnvironment
  ? {
      ...baseConfig,
      dialect: 'sqlite',
      host: 'localhost',
      port: 0,
      username: 'root',
      password: undefined,
      database: 'test',
      storage: process.env.DB_STORAGE || ':memory:',
    }
  : {
      ...baseConfig,
      dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
      host: process.env.DB_HOST || 'db',
      port: Number(process.env.DB_PORT) || 6543,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || undefined,
      database: process.env.DB_NAME || 'postgres',
      url: useLocalDatabase ? undefined : process.env.DATABASE_URL || undefined,
      dialectOptions: useSsl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized,
            },
          }
        : undefined,
      pool: {
        max: Number(process.env.DB_POOL_MAX) || 10,
        min: Number(process.env.DB_POOL_MIN) || 0,
        acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
        idle: Number(process.env.DB_POOL_IDLE) || 10000,
      },
      retry: {
        max: Number(process.env.DB_RETRY_MAX) || 3,
      },
    };

export default config;
