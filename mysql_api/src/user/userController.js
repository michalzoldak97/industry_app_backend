"use strict";
const { catchAsync, AppError } = require("../error");
const responseHandler = require("../handler");
const userModel = require("./userModel");

// admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.selectUsers();
  responseHandler.respond(
    { head: users, data: users },
    { sCode: 200, errCode: 404, errMessage: "No users found" },
    res,
    next
  );
});

//user if self || admin
exports.getUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) return next(new AppError("User identifier is missing", 404));
  const user = await userModel.selectUserById(userId);
  responseHandler.respond(
    { head: user, data: user },
    { sCode: 200, errCode: 404, errMessage: "User not found" },
    res,
    next
  );
});
