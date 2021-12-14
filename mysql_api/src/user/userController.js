"use strict";
const { catchAsync } = require("../error");
const responseHandler = require("../handler");
const user = require("./userModel");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await user.selectUsers(req.userId);
  responseHandler.respond(
    { head: users, data: users },
    { sCode: 200, errCode: 404, errMessage: "No users found" },
    res,
    next
  );
});
