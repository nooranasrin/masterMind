const Game = require('./game');

const startGame = function(req, res, next) {
  const game = new Game();
  game.initialize();
  res.send();
};

module.exports = { startGame };
