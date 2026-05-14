import dotenv from "dotenv";
import path from "path";
import { Dialect } from "sequelize";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development"
  ),
});

type DatabaseConfig = {
  dialect: Dialect;
  url: string;
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

const config: DatabaseConfig = {
  ...baseConfig,
  dialect: (process.env.DB_DIALECT as Dialect) || "postgres",
  url: process.env.DATABASE_URL as string,
};

export default config;