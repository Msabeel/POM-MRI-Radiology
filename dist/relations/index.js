'use strict';

function applyAssociatation(sequelize) {
    var _sequelize$models = sequelize.models,
        tran_noteboard = _sequelize$models.tran_noteboard,
        tran_reminder = _sequelize$models.tran_reminder,
        tran_image = _sequelize$models.tran_image,
        tran_checklist = _sequelize$models.tran_checklist,
        tran_labels = _sequelize$models.tran_labels;

    tran_noteboard.hasOne(tran_reminder, {
        foreignKey: 'noteboard_id'
    });
    tran_noteboard.hasOne(tran_image, {
        foreignKey: 'noteboard_id'
    });
    tran_noteboard.hasMany(tran_checklist, {
        foreignKey: 'noteboard_id'
    });
    tran_noteboard.hasMany(tran_labels, {
        foreignKey: 'noteboard_id'
    });
}
module.exports = { applyAssociatation: applyAssociatation };