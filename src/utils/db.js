// const mongoose = require("mongoose");

// // Export a function that connects to the MongoDB database
// module.exports = function () {
//   // Use Mongoose to connect to the MongoDB database specified in the environment variable MONGODB_URI
//   mongoose
//     .connect(process.env.MONGODB_URI, {
//       dbName: "testDb", // Specify the name of the database
//       useNewUrlParser: true, // Use the new URL parser
//       useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
//     })
//     .then(() => console.log(`Connected to ${process.env.MONGODB_URI}...`)); // Log a success message when connected
// };

const mongoose = require("mongoose");

async function connect() {
  const dbUri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(dbUri, {
      dbName: "testDb", // Specify the name of the database
      useNewUrlParser: true, // Use the new URL parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });
    console.info(`DB connected on ${process.env.MONGODB_URI}...`);
  } catch (error) {
    console.error("Could not connect to db");
    process.exit(1);
  }
}

module.exports = connect;
