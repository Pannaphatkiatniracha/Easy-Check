'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      lat: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      lng: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      photo: {
        type: Sequelize.BLOB('long'),
        allowNull: true
      },
      approval_status: {
        type: Sequelize.STRING(20),
        defaultValue: 'pending',
        allowNull: true
      },
      reject_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendance');
  }
};