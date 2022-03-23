const express = require('express');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/test2', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'post'
    });
});



app.get('/api/test2', (req, res, next) => {
    const stuff = { message: 'test2' };
    res.status(200).json(stuff);
});





app.use((req, res, next) => {
    console.log('received');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message: 'test' });
    next();
});

app.use((req, res, next) => {
    console.log('sent back');
});

module.exports = app;