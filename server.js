const app = require('./lib/routers');

const main = function() {
  app.listen(8000, () => console.log('server started listening on port 8000'));
};

main();
