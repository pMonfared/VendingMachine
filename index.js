const port = process.env.PORT || 3000;

const app = require("./src/app");
const connect = require("./src/utils/db");
// require("./src/utils/db")();

const server = app.listen(port, async () => {
  console.log(`Listening on port ${port}...`);

  await connect();
});

module.exports = server;
