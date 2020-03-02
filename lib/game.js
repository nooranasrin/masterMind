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

  checkWinStatus(colors) {
    const status = { correct: 0, wrongPlace: 0 };
    this.secretColors.forEach((color, index) => {
      if (color === colors[index]) {
        status.correct += 1;
        return;
      }
      if (colors.includes(color)) {
        status.wrongPlace += 1;
      }
    });
    const wrong = 5 - (status.correct + status.wrongPlace);
    status.wrong = wrong;
    return status;
  }
}

module.exports = Game;
