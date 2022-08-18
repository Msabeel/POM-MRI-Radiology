'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var db = {};

var _require = require('../relations'),
    applyAssociatation = _require.applyAssociatation;

var env = process.env.NODE_ENV || 'development';
var config = require('../env.json')[env];

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 20000,
        idle: 10000
    }
});

fs.readdirSync(__dirname).filter(function (file) {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
applyAssociatation(sequelize);
db.sequelize = sequelize;
module.exports = db;