"use strict";
const { AppError } = require("../error");

exports.isIdCorrect = (req, res, next) => {
  const id = +req.params.id;
  if (!id || id <= 0) return next(new AppError(`Id incorrect`, 404));
  next();
};
