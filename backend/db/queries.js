const {
    RaspberryPi,
    ActivationReport
} = require("./model");

// RPi

function getAllRaspberryPis(){
    return RaspberryPi.findAll({raw: true});
}

function getRaspberryPiById(id){
    return RaspberryPi.findAll({
        where: {
            Id: id
        },
        raw: true
    });
}

function insertRaspberryPi(name){
    return RaspberryPi.create({Name: name});
}


// Activation Report

function getAllActivationReports(){
    return ActivationReport.findAll({raw: true});
}


function getActivationReportById(id){
    return ActivationReport.findAll({
        where: {
            Id: id
        },
        raw: true
    });
}

function insertActivationReport(datetime, screenshotPath, videoPath, raspberryPiId){
    return ActivationReport.create({
        DateTime: datetime, 
        ScreenshotPath: screenshotPath, 
        VideoPath: videoPath,
        RaspberryPiId: raspberryPiId});
}
