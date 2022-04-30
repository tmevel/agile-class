const express = require('express');
const fs = require('fs');

liveStatus = require('./liveStatus');

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

app.post('/upload', function(request, respond) {
    console.log('a');
    filePath = __dirname + '/videofiles/'+(new Date())+'.mp4';
    console.log(filePath);
    request.pipe(fs.createWriteStream(filePath, {flags:'a'}));
});

module.exports = app;