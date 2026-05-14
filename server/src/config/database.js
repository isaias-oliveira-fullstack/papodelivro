const dotenv = require('dotenv');
const path = require('path');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 6543,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || 'papodelivro',
  url: process.env.DATABASE_URL || undefined,
  dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
},
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: false,
};

module.exports = config;
