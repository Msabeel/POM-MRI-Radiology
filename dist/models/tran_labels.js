'use strict';

module.exports = function (sequelize, DataTypes) {
    var NoteboardLabels = sequelize.define('tran_labels', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        noteboard_id: {
            type: DataTypes.INTEGER
        },
        label_id: {
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
        }
    }, {
        freezeTableName: true
    });
    return NoteboardLabels;
};