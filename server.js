const app = require('./lib/routers');

const port = process.env.PORT || 4000;

const main = function() {
  app.listen(port, () =>
    console.log(`server started listening on port ${port}`)
  );
};

main();
