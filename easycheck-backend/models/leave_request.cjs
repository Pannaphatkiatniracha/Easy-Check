// 'use strict';
// const { Model, DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   class LeaveRequest extends Model {}
//   LeaveRequest.init({
//     user_id: { type: DataTypes.STRING(50), allowNull: false },
//     leave_start: { type: DataTypes.DATEONLY, allowNull: false },
//     leave_end: { type: DataTypes.DATEONLY, allowNull: false },
//     leave_reasons: { type: DataTypes.TEXT },
//     other_reason: { type: DataTypes.TEXT },
//     evidence_file: { type: DataTypes.BLOB('long') },
//     status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
//     reject_reason: { type: DataTypes.TEXT }
//   }, {
//     sequelize,
//     modelName: 'LeaveRequest',
//     tableName: 'leave_requests',
//     underscored: true,
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: false
//   });
//   return LeaveRequest;
// };