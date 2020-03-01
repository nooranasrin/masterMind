class Game {
  constructor() {
    this.secretColors = [];
    this.colors = [
      'red',
      'blue',
      'green',
      'skyblue',
      'pink',
      'violet',
      'lawngreen',
      'tomato'
    ];
  }

  initialize() {
    while (this.secretColors.length < 5) {
      const color = this.colors[Math.floor(Math.random() * 6) + 1];
      if (this.secretColors.indexOf(color) === -1) {
        this.secretColors.push(color);
      }
    }
  }
}

module.exports = Game;
