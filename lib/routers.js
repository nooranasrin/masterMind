const express = require('express');
const app = express();
const handlers = require('./handlers');

app.use(express.static('public'));
app.get('/initialize', handlers.startGame);

module.exports = app;
