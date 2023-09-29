const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");

const authMiddleware = require("./../middlewares/authMiddleware");

module.exports = function (app) {
  //Express advance config
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/auth", authRoutes);

  // Authenticate user for all routes below this middleware
  app.use(authMiddleware);

  app.use("/users", userRoutes);
  app.use("/products", productRoutes);
};
