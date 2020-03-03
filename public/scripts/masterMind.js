const makeTheCurrentRowActive = function(row) {
  const currentRow = document.getElementById(`${row}`);
  currentRow.classList.add('pointerEventsAll');
};

const changeRow = function() {
  const row = +localStorage.getItem('row');
  localStorage.setItem('row', row + 1);
  makeTheCurrentRowActive(localStorage.getItem('row'));
};

const createNode = function(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
};

const generateNewButton = function() {
  const currentRow = document.getElementById(localStorage.getItem('row'));
  const button = '<button id="try" onclick="sendColors()">TRY</button>';
  currentRow.appendChild(createNode(button));
};

const showSecretPattern = function(secretColors) {
  const secretBoxes = [...document.getElementsByClassName('secretBox')];
  secretBoxes.forEach(
    (box, index) => (box.style.backgroundColor = secretColors[index])
  );
};

const showWinMessage = function(row) {
  const currentRow = document.getElementById(`${row}`);
  currentRow.appendChild(createNode('<div id="winMessage">You Won</div>'));
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

const showGameStatus = function(status) {
  const row = localStorage.getItem('row');
  let hindBoxes = [...document.getElementById(row).querySelectorAll('.hints')];
  if (row === '10') sendXHR('GET', 'secretPattern', showSecretPattern);
  if (status.correct === 5) return showWinMessage(row);
  hindBoxes = selectRandomBox(status.correct, hindBoxes, 'black');
  hindBoxes = selectRandomBox(status.wrongPlace, hindBoxes, 'grey');
  hindBoxes = selectRandomBox(status.wrong, hindBoxes, 'white');
  changeRow();
  generateNewButton();
  localStorage.removeItem('color');
};

const sendXHR = (method, url, callback, data) => {
  const req = new XMLHttpRequest();
  req.open(method, url);
  data && req.setRequestHeader('Content-Type', 'application/json');
  const content = data ? JSON.stringify(data) : null;
  req.send(content);

  req.onload = function() {
    if (this.status !== 200) return;
    let result = this.responseText;
    const contentType = this.getResponseHeader('Content-Type');
    if ('application/json; charset=utf-8' === contentType) {
      result = JSON.parse(this.responseText);
    }
    callback(result);
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
  sendXHR('POST', 'checkWinStatus', showGameStatus, colors);
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
