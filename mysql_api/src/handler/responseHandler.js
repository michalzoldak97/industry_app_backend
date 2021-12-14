"use strict";
const { AppError } = require("../error");

exports.respond = async (obj, conf, res, next) => {
  if (!obj.head) return next(new AppError(`${conf.errMessage}`, conf.errCode));
  res.status(conf.sCode).json({
    message: "success",
    response: {
      data: obj.data,
    },
  });
};

exports.respondEmpty = async (obj, conf, res, next) => {
  if (!obj.head) return next(new AppError(`${conf.errMessage}`, conf.errCode));
  res.status(conf.sCode).json({
    message: "success",
  });
};
