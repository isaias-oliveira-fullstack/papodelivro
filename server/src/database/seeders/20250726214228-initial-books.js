// @ts-nocheck
"use strict";
const slugify = require("slugify");

const booksToSeed = [
  {
    title: "Código Limpo",
    author: "Robert C. Martin",
    category: "Desenvolvimento de Software",
    coverFilename: "codigolimpio.jpg",
  },
  {
    title: "O Programador Pragmático",
    author: "Andrew Hunt & David Thomas",
    category: "Desenvolvimento de Software",
    coverFilename: "programadorpragmatico.jpg",
  },
  {
    title: "Você Não Conhece JS",
    author: "Kyle Simpson",
    category: "JavaScript",
    coverFilename: "voce-nao-conhece-js.jpg",
  },
  {
    title: "JavaScript: O Guia Definitivo",
    author: "Douglas Crockford",
    category: "JavaScript",
    coverFilename: "js-guia-definitivo.jpg",
  },
  {
    title: "Aprendendo React",
    author: "Alex Banks & Eve Porcello",
    category: "React",
    coverFilename: "aprendendo-react.jpg",
  },
  {
    title: "React na Prática",
    author: "Stoyan Stefanov",
    category: "React",
    coverFilename: "react-na-pratica.jpg",
  },
  {
    title: "O Caminho para React",
    author: "Robin Wieruch",
    category: "React",
    coverFilename: "caminho-react.jpg",
  },
  {
    title: "Refatorando Interfaces",
    author: "Adam Wathan & Steve Schoger",
    category: "UI/UX",
    coverFilename: "refatorando-ui.jpg",
  },
  {
    title: "Tailwind CSS na Prática",
    author: "Adam Wathan",
    category: "Tailwind CSS",
    coverFilename: "tailwind-pratica.jpg",
  },
  {
    title: "Arquitetura Limpa",
    author: "Robert C. Martin",
    category: "Arquitetura de Software",
    coverFilename: "arquitetura-limpa.jpg",
  },
  {
    title: "Padrões de Projeto",
    author: "Erich Gamma e outros",
    category: "Arquitetura de Software",
    coverFilename: "padroes-projeto.jpg",
  },
  {
    title: "Manual do TypeScript",
    author: "Microsoft",
    category: "TypeScript",
    coverFilename: "typescript-manual.jpg",
  },
  {
    title: "Padrões de React",
    author: "Carlos Santana",
    category: "React",
    coverFilename: "padroes-react.jpg",
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const booksToInsert = booksToSeed.map((book) => ({
      title: book.title,
      author: book.author,
      category: book.category,
      cover_url: `/src/assets/${book.coverFilename}`,
      slug: slugify(book.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }),
      status: "PENDING",
      user_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("books", booksToInsert, {
      ignoreDuplicates: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    const titles = booksToSeed.map((book) => book.title);
    await queryInterface.bulkDelete(
      "books",
      {
        title: {
          [Sequelize.Op.in]: titles,
        },
      },
      {},
    );
  },
};
