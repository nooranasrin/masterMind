const makeTheCurrentRowActive = function(row) {
  const currentRow = document.getElementById(`${row}`);
  currentRow.classList.add('pointerEventsAll');
};

const changeRow = function() {
  const row = +localStorage.getItem('row');
  localStorage.setItem('row', row + 1);
  makeTheCurrentRowActive(localStorage.getItem('row'));
};

const generateNewButton = function(row) {
  const currentRow = document.getElementById(`${row}`);
  const button = document.createElement('button');
  button.id = 'try';
  button.innerText = 'TRY';
  button.addEventListener('click', sendColors);
  currentRow.appendChild(button);
};

const showSecretPattern = function(secretColors) {
  const secretBoxes = [...document.getElementsByClassName('secretBox')];
  secretBoxes.forEach(
    (box, index) => (box.style.backgroundColor = secretColors[index])
  );
};

const showWinMessage = function(row) {
  const currentRow = document.getElementById(`${row}`);
  const div = document.createElement('div');
  div.id = 'winMessage';
  div.innerText = 'You Won';
  currentRow.appendChild(div);
  sendXHR('GET', 'secretPattern', showSecretPattern);
};

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
  console.log(localStorage.getItem('row'));
  if (localStorage.getItem('row') === '10')
    sendXHR('GET', 'secretPattern', showSecretPattern);
  if (correct === 5) return showWinMessage(localStorage.getItem('row'));
  hindBoxes = selectRandomBox(correct, hindBoxes, 'black');
  hindBoxes = selectRandomBox(wrongPlace, hindBoxes, 'grey');
  hindBoxes = selectRandomBox(wrong, hindBoxes, 'white');
  changeRow();
  generateNewButton(localStorage.getItem('row'));
  localStorage.removeItem('color');
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

const initializeGame = function() {
  sendXHR('GET', 'initialize', () => {});
  localStorage.setItem('row', 1);
  makeTheCurrentRowActive(localStorage.getItem('row'));
};

const deleteButtonAndMakeTheRowInactive = function() {
  const button = document.getElementById('try');
  button.parentNode.classList.remove('pointerEventsAll');
  button.parentNode.classList.add('pointerEventsNone');
  button.parentNode.removeChild(button);
};

const sendColors = function() {
  const className = localStorage.getItem('className');
  const boxes = document.querySelectorAll(`.${className}`);
  const colors = [...boxes].map(box => box.style.backgroundColor);
  if (colors.includes('')) return;
  sendXHR('POST', 'checkWinStatus', showGameStatus, colors, className);
  deleteButtonAndMakeTheRowInactive();
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
