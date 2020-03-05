const Game = require('./game');

const startGame = function(req, res, next) {
  const game = new Game();
  game.initialize();
  req.app.locals = { game };
  res.send();
};

const getAvailableColors = function(req, res, next) {
  res.json(req.game.getAvailableColors());
};

const attachGame = function(req, res, next) {
  req.game = req.app.locals.game;
  next();
};

const checkWinStatus = function(req, res, next) {
  const colors = req.body;
  const status = req.game.checkWinStatus(colors);
  res.json(status);
};

const getSecretColors = function(req, res, next) {
  res.json(req.game.getSecretColors());
};

module.exports = {
  startGame,
  checkWinStatus,
  attachGame,
  getSecretColors,
  getAvailableColors
};
