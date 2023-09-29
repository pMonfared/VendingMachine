const mongoose = require("mongoose");

const mongoDbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to ${process.env.MONGODB_URI}...`));
};

module.exports = mongoDbConnect;
