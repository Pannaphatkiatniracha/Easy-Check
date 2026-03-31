// 'use strict';
// const { Model, DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   class Attendance extends Model {}
//   Attendance.init({
//     user_id: { type: DataTypes.STRING(50), allowNull: false },
//     type: { type: DataTypes.STRING(20), allowNull: false },
//     lat: { type: DataTypes.STRING(50) },
//     lng: { type: DataTypes.STRING(50) },
//     status: { type: DataTypes.STRING(50) },
//     photo: { type: DataTypes.BLOB('long') },
//     approval_status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
//     reject_reason: { type: DataTypes.TEXT }
//   }, {
//     sequelize,
//     modelName: 'Attendance',
//     tableName: 'attendance',
//     underscored: true,
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: false
//   });
//   return Attendance;
// };