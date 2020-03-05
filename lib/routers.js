const express = require('express');
const app = express();
const handlers = require('./handlers');

app.use(express.static('public'));
app.use(express.json());
app.get('/initialize', handlers.startGame);
app.use(handlers.attachGame);
app.get('/secretPattern', handlers.getSecretColors);
app.get('/colors', handlers.getAvailableColors);
app.post('/checkWinStatus', handlers.checkWinStatus);

module.exports = app;
