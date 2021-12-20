"use strict";
const { catchAsync, AppError } = require("../error");
const responseHandler = require("../handler");
const userModel = require("./userModel");

exports.isIdCorrect = (req, res, next) => {
  const id = +req.params.id;
  if (!id || id <= 0) return next(new AppError(`Id incorrect`, 404));
  next();
};

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
  const user = await userModel.selectUserById(req.params.id);
  responseHandler.respond(
    { head: user[0]?.user_id, data: user },
    { sCode: 200, errCode: 404, errMessage: "User not found" },
    res,
    next
  );
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await userModel.deactivateUser(req.params.id);
  responseHandler.respondEmpty(
    { head: user, data: user },
    { sCode: 204, errCode: 404, errMessage: "User not found" },
    res,
    next
  );
});

exports.getUserChallenges = catchAsync(async (req, res, next) => {
  const challenges = await userModel.selectUserChallenges(req.params.id);
  responseHandler.respond(
    { head: challenges[0], data: challenges },
    { sCode: 200, errCode: 404, errMessage: "No challenges found" },
    res,
    next
  );
});

exports.getUserChallenge = catchAsync(async (req, res, next) => {
  const challenge = await userModel.selectUserChallenge(
    req.params.id,
    req.params?.challenge
  );
  responseHandler.respond(
    { head: challenge[0], data: challenge },
    { sCode: 200, errCode: 404, errMessage: "No challenges found" },
    res,
    next
  );
});

exports.signUpUserChallenge = catchAsync(async (req, res, next) => {
  const result = await userModel.insertUserChallenge(
    req.params.id,
    req.params?.challenge
  );
  responseHandler.respond(
    { head: +result, data: result },
    { sCode: 200, errCode: 404, errMessage: result },
    res,
    next
  );
});

exports.signOffUserChallenge = catchAsync(async (req, res, next) => {
  const result = await userModel.deleteUserChallenge(
    req.params.id,
    req.params?.challenge
  );
  responseHandler.respondEmpty(
    { head: +result, data: result },
    { sCode: 204, errCode: 404, errMessage: "User - challenge not found" },
    res,
    next
  );
});

exports.modifyUserChallenge = catchAsync(async (req, res, next) => {
  const result = await userModel.updateUserChallenge(
    req.body,
    req.params.id,
    req.params?.challenge
  );
  responseHandler.respondEmpty(
    { head: +result, data: result },
    { sCode: 204, errCode: 404, errMessage: "User - challenge not found" },
    res,
    next
  );
});