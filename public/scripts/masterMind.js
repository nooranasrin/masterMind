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
  return div.firstElementChild;
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

const deleteButtonAndMakeTheRowInactive = function() {
  const button = document.getElementById('try');
  button.parentNode.classList.remove('pointerEventsAll');
  button.parentNode.classList.add('pointerEventsNone');
  button.parentNode.removeChild(button);
};

const sendColors = function() {
  const row = localStorage.getItem('row');
  const boxes = document.getElementById(row).querySelectorAll(`.colorBox`);
  const colors = [...boxes].map(box => box.style.backgroundColor);
  if (colors.includes('')) return;
  sendXHR('POST', 'checkWinStatus', showGameStatus, colors);
  deleteButtonAndMakeTheRowInactive();
};

const changeColor = function() {
  const color = localStorage.getItem('color');
  event.target.style.backgroundColor = color;
};

const storeSelectedColor = function() {
  const color = event.target.style.backgroundColor;
  localStorage.setItem('color', color);
};

const generateColorPlacingBoxes = function(div, colorBox, hints) {
  const patternDiv = createNode(div);
  for (let count = 0; count < 5; count++) {
    patternDiv.prepend(createNode(colorBox));
    patternDiv.appendChild(createNode(hints));
  }
  return patternDiv;
};

const generatePatternDiv = function() {
  const colorBoxes = document.getElementById('colorBoxes');
  for (let row = 10; row > 0; row--) {
    let patternDiv = `<div class="patternDiv patternPlacingDiv " id="${row}">`;
    const colorBox = `<div class="colorBox selectedColor" onclick="changeColor()"></div>`;
    const hints = `<div class="hints"></div>`;
    patternDiv = generateColorPlacingBoxes(patternDiv, colorBox, hints);
    colorBoxes.append(patternDiv);
  }
  generateNewButton('1');
};

const generateColorSelectionBoxes = function(allColors) {
  const colorBoxes = document.getElementById('colors');
  allColors.forEach(color => {
    const html = ` <div class='colorBox boxExceptSecretBox' onclick='storeSelectedColor()' style='background-color:${color};'></div>`;
    colorBoxes.append(createNode(html));
  });
};

const main = function() {
  localStorage.setItem('row', 1);
  generatePatternDiv();
  sendXHR('GET', 'initialize', () => {});
  makeTheCurrentRowActive(localStorage.getItem('row'));
  sendXHR('GET', 'colors', generateColorSelectionBoxes);
};
