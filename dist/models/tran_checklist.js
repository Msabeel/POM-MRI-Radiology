'use strict';

module.exports = function (sequelize, DataTypes) {
    var NoteboardChecklist = sequelize.define('tran_checklist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        noteboard_id: {
            type: DataTypes.INTEGER
        },
        checklist_description: {
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
        checked: {
            type: DataTypes.BOOLEAN
        },
        deleted_on: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true
    });
    return NoteboardChecklist;
};