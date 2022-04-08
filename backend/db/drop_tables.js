const {
    RaspberryPi,
    ActivationReport
} = require("./model");

// Drop tables
ActivationReport.drop()
.catch(err => {console.log(err)});
RaspberryPi.drop()
.catch(err => {console.log(err)});