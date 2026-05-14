import db from '../models';

const Book = db.Book;
const User = db.User;
const Favorite = db.Favorite;

const modelNames = Object.keys(db).filter((k: string) => !['sequelize', 'Sequelize'].includes(k));
const duplicateNames = modelNames.filter((v: string, i: number, a: string[]) => a.indexOf(v) !== i);
const bookHasFavorites = !!Book?.associations?.favorites;
const userHasFavorites = !!User?.associations?.favorites;
const favBelongsBook = !!Favorite?.associations?.book;
const favBelongsUser = !!Favorite?.associations?.user;

console.log(JSON.stringify({
  modelNames,
  duplicateNames,
  favoriteLoaded: !!Favorite,
  bookHasFavorites,
  userHasFavorites,
  favoriteBelongsBook: favBelongsBook,
  favoriteBelongsUser: favBelongsUser,
  bookAssociations: Book?.associations ? Object.keys(Book.associations) : [],
  userAssociations: User?.associations ? Object.keys(User.associations) : [],
  favoriteAssociations: Favorite?.associations ? Object.keys(Favorite.associations) : [],
}, null, 2));
process.exit(0);

export {};
