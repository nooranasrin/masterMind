const selectRandomBox = function(count, hindBoxes, color) {
  let num = count;
  let boxes = hindBoxes;
  while (num > 0) {
    const index = Math.floor(Math.random() * boxes.length);
    boxes[index].style.display = 'block';
    boxes[index].style.backgroundColor = color;
    boxes.splice(index, 1);
    num--;
  }
  return boxes;
};

const showGameStatus = function(status, className) {
  const { correct, wrongPlace, wrong } = status;
  let hindBoxes = [...document.querySelectorAll(`.${className}Hints`)];
  hindBoxes = selectRandomBox(correct, hindBoxes, 'black');
  hindBoxes = selectRandomBox(wrongPlace, hindBoxes, 'grey');
  hindBoxes = selectRandomBox(wrong, hindBoxes, 'white');
};

const sendXHR = (method, url, callback, data, args) => {
  const req = new XMLHttpRequest();
  req.open(method, url);
  data && req.setRequestHeader('Content-Type', 'application/json');
  const content = data ? JSON.stringify(data, null, 2) : null;
  req.send(content);

  req.onload = function() {
    if (this.status !== 200) return;
    let result = this.responseText;
    const contentType = this.getResponseHeader('Content-Type');
    if ('application/json; charset=utf-8' === contentType) {
      result = JSON.parse(this.responseText);
    }
    callback(result, args);
  };
};

const makeTheCurrentRowActive = function(row) {
  const currentRow = document.getElementById(`${row}`);
  currentRow.classList.add('pointerEventsAll');
};

const initializeGame = function() {
  sendXHR('GET', 'initialize', () => {});
  localStorage.setItem('row', 1);
  makeTheCurrentRowActive(localStorage.getItem('row'));
};

const sendColors = function() {
  const className = localStorage.getItem('className');
  const boxes = document.querySelectorAll(`.${className}`);
  const colors = [...boxes].map(box => box.style.backgroundColor);
  if (colors.includes('')) return;
  sendXHR('POST', 'checkWinStatus', showGameStatus, colors, className);
  const button = document.getElementById('try');
  button.parentNode.classList.add('pointerEventsNone');
  button.parentNode.removeChild(button);
};

const changeColor = function() {
  const color = localStorage.getItem('color');
  event.target.style.backgroundColor = color;
  const className = event.target.className.split(' ')[2];
  localStorage.setItem('className', className);
};

const storeSelectedColor = function() {
  const color = event.target.style.backgroundColor;
  localStorage.setItem('color', color);
};
