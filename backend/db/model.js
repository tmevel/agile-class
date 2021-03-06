const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require("./authenticate");

// Database Model

class RaspberryPi extends Model {}

RaspberryPi.init({
  Id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'RaspberryPi'
});


class ActivationReport extends Model {}

ActivationReport.init({
  Id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  DateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  VideoPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CameraId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'ActivationReport'
});

//RaspberryPi.hasOne(ActivationReport, {allowNull: false});

module.exports = {
  RaspberryPi,
  ActivationReport
};