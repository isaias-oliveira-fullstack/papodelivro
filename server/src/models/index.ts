import fs from 'fs';
import path from 'path';
import { Sequelize, Model, ModelStatic } from 'sequelize';
import config from '../config/database.simple';

const basename = path.basename(__filename);
const db: Record<string, ModelStatic<Model> | any> = {};

const sequelizeOptions = { ...config };
const sequelize = config.url
  ? (() => {
      const { url, ...options } = sequelizeOptions;
      return new Sequelize(config.url, options as any);
    })()
  : new Sequelize(config.database, config.username, config.password ?? undefined, config as any);

const resolveModel = (moduleExport: unknown): any => {
  if (typeof moduleExport === 'function' && moduleExport.prototype instanceof Model) {
    return moduleExport;
  }

  if (moduleExport && typeof moduleExport === 'object') {
    const maybeDefault = (moduleExport as { default?: unknown }).default;
    if (typeof maybeDefault === 'function' && maybeDefault.prototype instanceof Model) {
      return maybeDefault;
    }
  }

  return undefined;
};

fs.readdirSync(__dirname)
  .filter((file) =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    (file.slice(-3) === '.ts' || file.slice(-3) === '.js')
  )
  .forEach((file: string) => {
    const requiredModule: any = require(path.join(__dirname, file));
    const modelFile: any = resolveModel(requiredModule) ?? resolveModel(requiredModule?.default);

    if (modelFile && typeof modelFile.initialize === 'function') {
      modelFile.initialize(sequelize);
      db[modelFile.name] = modelFile;
    }
  });

Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const isTestEnvironment = process.env.NODE_ENV === 'test' || typeof process.env.JEST_WORKER_ID !== 'undefined';

console.log('Configuração Sequelize:', {
  host: config.host,
  database: config.database,
  username: config.username,
  dialect: config.dialect,
});

const authenticateAndSync = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado com sucesso ao banco de dados!');

    if (isTestEnvironment) {
      await sequelize.sync({ force: true });
      console.log('Banco de dados de teste sincronizado com sucesso.');
    }
  } catch (err: unknown) {
    console.error('Erro ao conectar no banco de dados:', err);
  }
};

// Só conecta automaticamente se não estiver no Vercel
if (!process.env.VERCEL) {
  const ready = authenticateAndSync();
  db.ready = ready;
} else {
  // No Vercel, conecta apenas quando necessário
  db.ready = Promise.resolve();
}

export = db;
