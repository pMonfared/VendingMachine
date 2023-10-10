// Import required modules
const express = require("express");
const cors = require("cors");
const swaggerDocs = require("./utils/swagger");
const port = process.env.PORT || 3000;

// Create an Express application
const app = express();

swaggerDocs(app, port);

// Define allowed origins for CORS (Cross-Origin Resource Sharing)
const allowedOrigins = ["http://localhost:5001", "http://localhost:3000"];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request origin is in the allowedOrigins array
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow the request to proceed
      callback(null, true);
    } else {
      // Deny the request with a CORS error
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Use the CORS middleware with the specified options
app.use(cors(corsOptions));

// Configure Express to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Include and configure routes for the application
require("./routes")(app);

// Export the configured Express application
module.exports = app;
