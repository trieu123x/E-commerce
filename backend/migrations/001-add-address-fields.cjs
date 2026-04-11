'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add new columns
      await queryInterface.addColumn(
        'addresses',
        'house_number',
        {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'addresses',
        'street_name',
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'addresses',
        'city',
        {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'addresses',
        'province',
        {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('addresses', 'house_number', { transaction });
      await queryInterface.removeColumn('addresses', 'street_name', { transaction });
      await queryInterface.removeColumn('addresses', 'city', { transaction });
      await queryInterface.removeColumn('addresses', 'province', { transaction });
    });
  }
};
