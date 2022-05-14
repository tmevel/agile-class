const express = require('express');
const fs = require('fs');

liveStatus = require('./liveStatus');

const {
    getActivationReportById, 
    getActivationReportTimeStamps, 
    getAllActivationReports, 
    getAllRaspberryPis, 
    getRaspberryPiById,
    getRaspberryPiByName,
    insertActivationReport, 
    insertRaspberryPi,
    getActivationReportVideoPath,
    getActivationReportScreenshotPath
} = require('./db/queries');

const VIDEO_DIR = "/videofiles/";
const VIDEO_TYPE = ".mp4"
const IMAGE_DIR = "/imagefiles/"
const IMAGE_TYPE = ".jpg"

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.get('/api/liveStatus', (req, res, next) => {
    let status = liveStatus.getStatus(parseInt(req.query.id))
    res.status(200).json({
        status: status
    })
})


app.get('/api/toggleLiveStatus', (req, res, next) => {
    let status = liveStatus.toggleStatus(parseInt(req.query.id))
    res.status(201).json({
        status: status
    })
})

app.get('/api/livesList', (req, res, next) => {
    res.status(200).json({
        lives: liveStatus.getLivesList()
    })
})

app.get('/api/createLive', (req, res, next) => {
    res.status(200).json({
        status: liveStatus.createLive()
    })
})

app.get('/api/deleteLive', (req, res, next) => {
    liveStatus.deleteLive(parseInt(req.query.id))
    res.status(200)
})

app.post('/upload', function(request, respond) {
    //filePath = __dirname + '/videofiles/'+(new Date())+'.mp4';
    filePath = __dirname + VIDEO_DIR + request.body.fileName + VIDEO_TYPE;
    console.log(filePath);
    request.pipe(fs.createWriteStream(filePath, {flags:'a'}));
});

// Activation reports

// GET
/*
    report:
        [
            {
                Datetime: string,
                ScreenshotPath: string,
                VideoPath: string,
                RaspberryPiId: int,
                Id: int
            }
        ]
*/
app.get('/api/reports/:id', (req, res, next) => {

    getActivationReportById(req.params.id)
    .then( qry => {
        res.status(201).json({
                report: qry
            })
    }
    )
    .catch( _ =>
        res.status(500).json()
    );
});

// get the video recorded for an activation report
app.get("/api/videos/:id", (req, res, next) => {

    getActivationReportVideoPath(req.params.id)
    .then( qry => {
        res.download(qry.VideoPath)
    }
    )
    .catch( _ =>
        res.status(500).json()
    );
});

// get the screenshot recorded for an activation report
app.get("/api/images/:id", (req, res, next) => {

    getActivationReportScreenshotPath(req.params.id)
    .then( qry => {
        res.download(qry.ScreenshotPath)
    }
    )
    .catch( _ =>
        res.status(500).json()
    );
});

/*
    reports:
        [
            {
                Datetime: string,
                ScreenshotPath: string,
                VideoPath: string,
                RaspberryPiId: int,
                Id: int
            }
        ]
*/
app.get('/api/reports', (req, res, next) => {
    getAllActivationReports()
    .then( qry =>
        res.status(201).json({
                reports: qry
            })
    )
    .catch( _ =>
        res.status(500).json()
    );
});

// POST
/*
    [
        {
            Datetime: string,
            ScreenshotPath: string,
            VideoPath: string,
            RaspberryPiName: string
        }
    ]
*/
app.post('/api/reports', (req, res, next) => {

    getRaspberryPiByName(req.body.RaspberryPiName)
    .then( rasp =>
        insertActivationReport(req.body.Datetime, __dirname + IMAGE_DIR + req.body.ScreenshotPath + IMAGE_TYPE, 
                                __dirname + VIDEO_DIR + req.body.VideoPath + VIDEO_TYPE, rasp.Id)
        .then( qry =>
            res.status(201).json({
            report: qry
            })
        )
        .catch( _ =>
            res.status(400).json()
        )
    )
    .catch(_ =>
        res.status(500).json()    
    )
});

// Timestamps

// GET
/*
    timestamps:
        [
            {
                Datetime: string
            }
        ]
*/
app.get('/api/timestamps', (req, res, next) => {

    getActivationReportTimeStamps()
    .then( qry =>
        res.status(201).json({
            timestamps: qry
        })
    )
    .catch( _ =>
        res.status(500).json()
    )
});

// Raspberry Pis

// GET
/*
    pi:
        [
            {
                Name: string,
                Id: int
            }
        ]
*/
app.get('/api/pis/:id', (req, res, next) => {
    getRaspberryPiById(req.params.id)
    .then( qry =>
        res.status(201).json({
            pi: qry
        })
    )
    .catch( _ =>
        res.status(500).json()
    )
});


/*
    pis:
        [
            {
                Name: string,
                Id: int
            }
        ]
*/
app.get('/api/pis', (req, res, next) => {
    getAllRaspberryPis()
    .then( qry =>
        res.status(201).json({
            pis: qry
        })
    )
    .catch( _ =>
        res.status(500).json()
    )
});

// POST
/*
    {
        Name: string
    }
*/
app.post('/api/pis', (req, res, next) => {

    // try to insert the ne raspberry pi
    insertRaspberryPi(req.body.Name)
    .then(qry => {
        res.status(201).json({
            pi: qry
        });
    })
    .catch(err => {
        // if it already exists, get the existing one
        if (err.name === "SequelizeUniqueConstraintError"){
            getRaspberryPiByName(req.body.Name)
            .then(qry => {
                res.status(201).json({
                    pi: qry
                });
            })
            .catch(_ => res.status(500).json())
        }
        else{
            res.status(400).json();
        }
    })

    /*
    // old version with getter first
    // try to get the raspberry
    // if it does not exist insert it in the database
    getRaspberryPiByName(req.body.Name)
            .then(qry => {
                if (qry === null){
                    insertRaspberryPi(req.body.Name)
                    .then(query => {
                        res.status(201).json({
                            pi: query
                    });
            })
            .catch(_ => {
                res.status(400).json();
            })
                }
                else{
                    res.status(201).json({
                        pi: qry
                    });
                }
            })
    .catch(_ => {
        res.status(500).json()
    })
    */
});

module.exports = app;