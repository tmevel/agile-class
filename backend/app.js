const express = require('express');

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

module.exports = app;