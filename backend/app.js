const express = require('express');

liveStatus = require('./liveStatus');

const {
    getActivationReportById, 
    getActivationReportTimeStamps, 
    getAllActivationReports, 
    getAllRaspberryPis, 
    getRaspberryPiById, 
    insertActivationReport, 
    insertRaspberryPi} = require('./db/queries');


const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/api/liveStatus', (req, res, next) => {
    res.status(200).json({
        status: liveStatus.status
    });
});


app.get('/api/toggleLiveStatus', (req, res, next) => {
    liveStatus.toggleStatus();
    res.status(201).json({
        status: liveStatus.status
    });
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
    .then( qry =>
        res.status(201).json({
                report: qry
            })
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
            RaspberryPiId: int
        }
    ]
*/
app.post('/api/reports', (req, res, next) => {

    insertActivationReport(req.body.Datetime, req.body.ScreenshotPath, req.body.VideoPath, req.body.RaspberryPiId)
    .then( qry =>
        res.status(201).json({
        report: qry
        })
    )
    .catch( _ =>
        res.status(400).json()
    );
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

    insertRaspberryPi(req.body.Name)
    .then( qry =>
        res.status(201).json({
        pi: qry
        })
    )
    .catch( _ =>
        res.status(400).json()
    );
});

module.exports = app;