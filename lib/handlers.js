const Game = require('./game');

const startGame = function(req, res, next) {
  const game = new Game();
  game.initialize();
  req.app.locals = { game };
  res.send();
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

module.exports = { startGame, checkWinStatus, attachGame };
