'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    employee_id: { type: DataTypes.STRING(6), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100) },
    phone: { type: DataTypes.STRING(15) },
    birth_date: { type: DataTypes.DATEONLY },
    join_date: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: false },
    position: { type: DataTypes.ENUM('Budgeting & Planning Officer','Cybersecurity Specialist','Payroll Specialist','Content Marketing Executive','Customer Experience Analyst','Sales Coordinator','Key Account Manager','Content Creator','Motion Graphic Designer','Approver','Admin','Super Admin'), allowNull: false },
    department: { type: DataTypes.ENUM('Finance', 'IT', 'Sales', 'Creative'), allowNull: false },
    branch: { type: DataTypes.ENUM('Bangkok', 'Chiang Mai', 'Phuket', 'Chonburi'), allowNull: false },
    shift: { type: DataTypes.STRING(50), allowNull: false },
    avatar: { type: DataTypes.STRING(500), defaultValue: '/img/default.jpg' },
    role: { type: DataTypes.ENUM('user', 'approver', 'admin', 'superadmin'), defaultValue: 'user' }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return User;
};