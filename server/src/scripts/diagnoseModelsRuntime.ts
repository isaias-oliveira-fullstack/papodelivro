import db from '../models';
import { Model } from 'sequelize';

console.log('db keys', Object.keys(db).filter((key) => !['sequelize', 'Sequelize'].includes(key)));
console.log('Book type', typeof db.Book, db.Book?.name);
console.log('Favorite type', typeof db.Favorite, db.Favorite?.name);
console.log('Book is Sequelize Model class?', db.Book && db.Book.prototype instanceof Model);
console.log('Favorite is Sequelize Model class?', db.Favorite && db.Favorite.prototype instanceof Model);
console.log('Book assoc keys', db.Book ? Object.keys(db.Book.associations || {}) : []);
console.log('Favorite assoc keys', db.Favorite ? Object.keys(db.Favorite.associations || {}) : []);
process.exit(0);

export {};
