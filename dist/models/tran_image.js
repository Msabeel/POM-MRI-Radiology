'use strict';

module.exports = function (sequelize, DataTypes) {
    var NoteboardImage = sequelize.define('tran_image', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        noteboard_id: {
            type: DataTypes.INTEGER
        },
        image_path: {
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
    return NoteboardImage;
};