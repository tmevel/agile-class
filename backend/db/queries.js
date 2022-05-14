const {
    RaspberryPi,
    ActivationReport
} = require("./model");

// RPi

function getAllRaspberryPis(){
    return RaspberryPi.findAll(
        {
            raw: true,
            attributes: {exclude: ['updatedAt', 'createdAt']}
        }
    );
}

function getRaspberryPiById(id){
    return RaspberryPi.findOne({
        where: {
            Id: id
        },
        raw: true,
        attributes: {exclude: ['updatedAt', 'createdAt']}
    });
}

function getRaspberryPiByName(name){
    return RaspberryPi.findOne({
        where: {
            Name: name
        },
        raw: true,
        attributes: {exclude: ['updatedAt', 'createdAt']}
    });
}

function insertRaspberryPi(name){
    return RaspberryPi.create({Name: name});
}


// Activation Report

function getAllActivationReports(){
    return ActivationReport.findAll(
    {
    raw: true,
    attributes: {exclude: ['updatedAt', 'createdAt']}
    });
}


function getActivationReportById(id){
    return ActivationReport.findOne({
        where: {
            Id: id
        },
        raw: true,
        attributes: {exclude: ['updatedAt', 'createdAt']}
    });
}

function getActivationReportVideoPath(id){
    return ActivationReport.findOne({
        where: {
            Id: id
        },
        raw: true,
        attributes: ['VideoPath']
    });
}

function getActivationReportScreenshotPath(id){
    return ActivationReport.findOne({
        where: {
            Id: id
        },
        raw: true,
        attributes: ['ScreenshotPath']
    });
}

function insertActivationReport(datetime, screenshotPath, videoPath, raspberryPiId){
    return ActivationReport.create({
        DateTime: datetime, 
        ScreenshotPath: screenshotPath, 
        VideoPath: videoPath,
        RaspberryPiId: raspberryPiId});
}

function getActivationReportTimeStamps(){
    return ActivationReport.findAll({
        attributes: ['DateTime'],
        raw: true
    });
}

module.exports = {
    getAllRaspberryPis,
    getRaspberryPiById,
    getRaspberryPiByName,
    insertRaspberryPi,
    getAllActivationReports,
    getActivationReportById,
    insertActivationReport,
    getActivationReportTimeStamps,
    getActivationReportVideoPath,
    getActivationReportScreenshotPath
}