"use strict";
const express = require("express");
const { AppError, globalErrorHandler } = require("./error");
const router = require("./routes");
const userVerifier = require("./auth");
const app = express();

app.use(express.json());

app.use(userVerifier.verify);

app.use("/", router);

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
