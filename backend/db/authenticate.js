const Sequelize = require('sequelize');

const path = 'mysql://agile_server:bHlBCfryWBZxY7f@localhost/CAMERA_MONITORING';
const sequelize = new Sequelize(path);

module.exports = sequelize;