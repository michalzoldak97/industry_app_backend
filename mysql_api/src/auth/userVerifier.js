"use strict";

const { catchAsync, AppError } = require("../error");
const axios = require("axios");

exports.verify = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new AppError("Authorization failed", 401));
  const token = req.headers.authorization.split(" ")[1];
  const response = await axios
    .post(`http://login_register_api:8082/verify`, {
      token,
    })
    .catch((err) => {
      return next(new AppError("User authentication failed", 401));
    });
  const userId = response.data.data.userId;
  if (!userId) return next(new AppError("Invalid user data", 401));
  req.userId = userId;
  next();
});
