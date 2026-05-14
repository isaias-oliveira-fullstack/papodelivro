import fs from 'fs';
import path from 'path';
import { Sequelize, Model } from 'sequelize';
import config from '../config/database';

const modelsDir = path.resolve(__dirname, '..', 'models');
const sequelizeOptions = { ...config };
const sequelize = config.url
  ? (() => {
      const { url, ...options } = sequelizeOptions;
      return new Sequelize(config.url, options as any);
    })()
  : new Sequelize(config.database, config.username, config.password ?? undefined, config);

const db: any = {};

fs.readdirSync(modelsDir)
  .filter((file) => file.indexOf('.') !== 0 && file !== path.basename(__filename) && (file.slice(-3) === '.ts' || file.slice(-3) === '.js'))
  .forEach((file: string) => {
    const moduleExport: any = require(path.join(modelsDir, file));
    const resolveModel = (moduleValue: unknown): any => {
      if (typeof moduleValue === 'function' && moduleValue.prototype instanceof Model) {
        return moduleValue;
      }

      if (moduleValue && typeof moduleValue === 'object') {
        const maybeDefault = (moduleValue as any).default;
        if (typeof maybeDefault === 'function' && maybeDefault.prototype instanceof Model) {
          return maybeDefault;
        }
      }

      return undefined;
    };

    const model = resolveModel(moduleExport) ?? resolveModel(moduleExport?.default);
    console.log('--- file', file, '---');
    console.log(' module type', typeof moduleExport);
    console.log(' module names', Object.getOwnPropertyNames(moduleExport));
    console.log(' module.__esModule', moduleExport?.__esModule);
    console.log(' module.default type', typeof moduleExport?.default, 'name', moduleExport?.default?.name);
    console.log(' selected model type', typeof model, 'name', model?.name);
    console.log(' selected isModelClass', model?.prototype instanceof Model);
    if (model && typeof model.init === 'function') {
      model.init(sequelize);
      db[model.name] = model;
    }
  });

console.log('loaded db keys', Object.keys(db));
console.log('Book is model', db.Book && db.Book.prototype instanceof Model);
console.log('Favorite is model', db.Favorite && db.Favorite.prototype instanceof Model);
console.log('User is model', db.User && db.User.prototype instanceof Model);
console.log('Book === Favorite', db.Book === db.Favorite);
console.log('Book === Book.default', db.Book === (db.Book?.default || undefined));
console.log('Favorite === Favorite.default', db.Favorite === (db.Favorite?.default || undefined));

process.exit(0);

export {};
