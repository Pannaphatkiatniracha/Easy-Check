'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leave_requests', {
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
      leave_start: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      leave_end: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      leave_reasons: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      other_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      evidence_file: {
        type: Sequelize.BLOB('long'),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: true
      },
      reject_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leave_requests');
  }
};