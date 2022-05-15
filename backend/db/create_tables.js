const {
    RaspberryPi,
    ActivationReport
} = require("./model");

// Create tables
ActivationReport.sync()
.catch(err => {console.log(err)});
RaspberryPi.sync()
.catch(err => {console.log(err)});