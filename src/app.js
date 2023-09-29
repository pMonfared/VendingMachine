const express = require("express");

const app = express();

//Express advance config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

module.exports = app;
