'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('messages');

    if (!tableDefinition.reply) {
      await queryInterface.addColumn('messages', 'reply', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (!tableDefinition.replied_at) {
      await queryInterface.addColumn('messages', 'replied_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    if (!tableDefinition.is_read) {
      await queryInterface.addColumn('messages', 'is_read', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface) => {
    const tableDefinition = await queryInterface.describeTable('messages');

    if (tableDefinition.reply) {
      await queryInterface.removeColumn('messages', 'reply');
    }

    if (tableDefinition.replied_at) {
      await queryInterface.removeColumn('messages', 'replied_at');
    }

    if (tableDefinition.is_read) {
      await queryInterface.removeColumn('messages', 'is_read');
    }
  },
};
