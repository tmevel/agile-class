const express = require('express');
const fs = require('fs');

liveStatus = require('./liveStatus');

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
    res.status(201).json({
        status: status
    })
})

app.post('/upload', function(req, res) {
    filePath = __dirname + '/videofiles/'+Date.now()+'_'+parseInt(req.query.id)+'.avi';
    console.log(filePath+' saved');
    req.pipe(fs.createWriteStream(filePath, {flags:'a'}));
    res.status(201).json({
        status: "done"
    })
});

module.exports = app;