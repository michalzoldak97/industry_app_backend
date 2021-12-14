"use strict";
const express = require("express");
const { AppError, globalErrorHandler } = require("./error");
const { userRouter } = require("./routes");
const app = express();
const userVerifier = require("./auth");

app.use(express.json());

app.use(userVerifier.verify);

app.use("/user", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
