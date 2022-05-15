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
    insertRaspberryPi
} = require('./db/queries');


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
    liveStatus.deleteDeadLives()
    res.status(200).json({
        lives: liveStatus.getLivesList()
    })
})

app.get('/api/keepAlive', (req, res, next) => {
    liveStatus.keepAlive(parseInt(req.query.id))
    let status = liveStatus.getStatus(parseInt(req.query.id))
    res.status(201).json()
})

app.post('/upload', function(req, res) {
    try{
        filePath = __dirname + '/videofiles/'+Date.now()+'_'+parseInt(req.query.id)+'.avi';
        console.log(filePath+' saved');
        req.pipe(fs.createWriteStream(filePath, {flags:'a'}));

        insertActivationReport(new Date(), filePath, req.query.id)

        res.status(201).json()
    }catch(e){
        print(e)
        res.status(400).json()
    }
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
            RaspberryPiName: string
        }
    ]
*/
app.post('/api/reports', (req, res, next) => {

    getRaspberryPiByName(req.body.RaspberryPiName)
    .then( rasp =>
        insertActivationReport(req.body.Datetime, req.body.ScreenshotPath, req.body.VideoPath, rasp.Id)
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