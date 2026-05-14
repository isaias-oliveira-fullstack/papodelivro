import BookModule from '../models/Book';
import FavoriteModule from '../models/Favorite';
import * as sequelize from 'sequelize';

console.log('BookModule typeof', typeof BookModule);
console.log('BookModule names', Object.getOwnPropertyNames(BookModule));
console.log('BookModule name', BookModule.name);
console.log('BookModule prototype', !!BookModule.prototype, BookModule.prototype?.constructor?.name);
console.log('BookModule instanceof Model', BookModule.prototype instanceof sequelize.Model);

console.log('FavoriteModule typeof', typeof FavoriteModule);
console.log('FavoriteModule names', Object.getOwnPropertyNames(FavoriteModule));
console.log('FavoriteModule name', FavoriteModule.name);
console.log('FavoriteModule prototype', !!FavoriteModule.prototype, FavoriteModule.prototype?.constructor?.name);
console.log('FavoriteModule instanceof Model', FavoriteModule.prototype instanceof sequelize.Model);
