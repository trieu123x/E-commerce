'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS unaccent');
  },

  async down(queryInterface, Sequelize) {
    // Usually we don't drop unaccent in down as it might be used by other parts
    // await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS unaccent');
  }
};
