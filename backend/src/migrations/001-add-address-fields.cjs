'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns already exist
    const table = await queryInterface.describeTable('addresses');
    
    const columnsToAdd = [];
    if (!table.house_number) columnsToAdd.push('house_number');
    if (!table.street_name) columnsToAdd.push('street_name');
    if (!table.city) columnsToAdd.push('city');
    if (!table.province) columnsToAdd.push('province');

    for (const column of columnsToAdd) {
      const columnDefs = {
        'house_number': {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        'street_name': {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        'city': {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        'province': {
          type: Sequelize.STRING(100),
          allowNull: true,
        }
      };
      
      await queryInterface.addColumn('addresses', column, columnDefs[column]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('addresses');
    
    if (table.house_number) await queryInterface.removeColumn('addresses', 'house_number');
    if (table.street_name) await queryInterface.removeColumn('addresses', 'street_name');
    if (table.city) await queryInterface.removeColumn('addresses', 'city');
    if (table.province) await queryInterface.removeColumn('addresses', 'province');
  }
};
