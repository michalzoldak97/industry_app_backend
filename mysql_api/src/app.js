"use strict";
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const { AppError, globalErrorHandler } = require("./error");
const { userRouter, challengeRouter, sleepRouter } = require("./routes");
const app = express();
const userVerifier = require("./auth");

app.use(
  cors({
    origin: "https://industry4medical.com",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(helmet());

app.use(xss());

app.use(userVerifier.verify);

app.use("/user", userRouter);

app.use("/challenge", challengeRouter);

app.use("/sleepdata", sleepRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
