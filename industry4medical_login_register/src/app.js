const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const { AppError, globalErrorHandler } = require("./error");
const router = require("./routes");
const app = express();

app.use(express.json());

app.use(helmet());

app.use(xss());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", router);

app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
