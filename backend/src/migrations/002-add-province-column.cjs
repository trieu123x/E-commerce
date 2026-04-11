'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if province column already exists
    const table = await queryInterface.describeTable('addresses');
    if (!table.province) {
      await queryInterface.addColumn(
        'addresses',
        'province',
        {
          type: Sequelize.STRING(100),
          allowNull: true,
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('addresses');
    if (table.province) {
      await queryInterface.removeColumn('addresses', 'province');
    }
  }
};
