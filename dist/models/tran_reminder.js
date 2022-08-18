'use strict';

module.exports = function (sequelize, DataTypes) {
    var Reminder = sequelize.define('tran_reminder', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        noteboard_id: {
            type: DataTypes.INTEGER
        },
        reminder_date: {
            type: DataTypes.DATE
        },
        created_on: {
            type: DataTypes.DATE
        },
        created_by: {
            type: DataTypes.INTEGER
        },
        delete: {
            type: DataTypes.BOOLEAN
        },
        deleted_on: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true
    });
    return Reminder;
};