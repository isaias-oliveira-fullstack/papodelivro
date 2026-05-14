'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_books_status" ADD VALUE IF NOT EXISTS 'REJECTED';`
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remover um valor de ENUM no PostgreSQL não é trivial;
    // esta reversão é intencionalmente deixada em branco.
  },
};
