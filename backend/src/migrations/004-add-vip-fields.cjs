'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Check if columns already exist
      const table = await queryInterface.describeTable('users', { transaction });
      
      if (!table.is_vip) {
        await queryInterface.addColumn('users', 'is_vip', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }, { transaction });
      }

      if (!table.total_spent) {
        await queryInterface.addColumn('users', 'total_spent', {
          type: Sequelize.DECIMAL(15, 2),
          defaultValue: 0,
          allowNull: false
        }, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('users', { transaction });
      
      if (table.is_vip) {
        await queryInterface.removeColumn('users', 'is_vip', { transaction });
      }

      if (table.total_spent) {
        await queryInterface.removeColumn('users', 'total_spent', { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
