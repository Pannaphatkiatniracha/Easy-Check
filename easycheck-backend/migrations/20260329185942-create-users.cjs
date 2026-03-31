'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
        defaultValue: null
      },
      birth_date: {
        type: Sequelize.DATEONLY, // เก็บแค่ YYYY-MM-DD ตามแบบในรูปค่ะ
        allowNull: true,
        defaultValue: null
      },
      join_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },
      position: {
        type: Sequelize.ENUM(
          'Budgeting & Planning Officer', 
          'Cybersecurity Specialist', 
          'Payroll Specialist', 
          'Content Marketing Executive',
          'Customer Experience Analyst',
          'Sales Coordinator',
          'Key Account Manager',
          'Content Creator',
          'Motion Graphic Designer',
          'Approver','Admin','Super Admin'
        ),
        allowNull: false
      },
      department: {
        type: Sequelize.ENUM('Finance', 'IT', 'Sales', 'Creative'),
        allowNull: false
      },
      branch: {
        type: Sequelize.ENUM('Bangkok', 'Chiang Mai', 'Phuket', 'Chonburi'),
        allowNull: false
      },
      shift: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: '/img/default.jpg'
      },
      role: {
        type: Sequelize.ENUM('user', 'approver', 'admin', 'superadmin'),
        allowNull: false,
        defaultValue: 'user'
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};