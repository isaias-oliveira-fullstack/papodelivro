import dotenv from 'dotenv';
import path from 'path';
import { Dialect } from 'sequelize';

dotenv.config({ path: path.resolve(process.cwd(), '.env.production'), override: true });
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
  logging: process.env.NODE_ENV === 'production' ? false : true,
};

const config: DatabaseConfig = {
  ...baseConfig,
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'papodelivro',
  url: process.env.DATABASE_URL,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : undefined,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
};

export default config;