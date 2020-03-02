const showGameStatus = function(responseText) {
  console.log(responseText);
};

const sendXHR = (method, url, callback, data) => {
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
    callback(result);
  };
};

const initializeGame = function() {
  sendXHR('GET', 'initialize', () => {});
};

const changeColor = function() {
  const color = localStorage.getItem('color');
  event.target.style.backgroundColor = color;
  const className = event.target.className.split(' ')[2];
  const boxes = document.querySelectorAll(`.${className}`);
  const colors = [...boxes].map(box => box.style.backgroundColor);
  if (!colors.includes(''))
    sendXHR('POST', 'checkWinStatus', showGameStatus, colors);
};

const storeSelectedColor = function() {
  const color = event.target.style.backgroundColor;
  localStorage.setItem('color', color);
};
