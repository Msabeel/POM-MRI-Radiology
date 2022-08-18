'use strict';

module.exports = function (sequelize, DataTypes) {
    var Noteboard = sequelize.define('tran_noteboard', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        note_title: {
            type: DataTypes.STRING
        },
        note_description: {
            type: DataTypes.STRING
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
        },
        archive: {
            type: DataTypes.BOOLEAN
        },
        archive_date: {
            type: DataTypes.DATE
        }

    }, {
        freezeTableName: true
    });
    return Noteboard;
};