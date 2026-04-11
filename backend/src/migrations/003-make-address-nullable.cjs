'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change address column to allow NULL
    await queryInterface.changeColumn('addresses', 'address', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to NOT NULL
    await queryInterface.changeColumn('addresses', 'address', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  }
};
