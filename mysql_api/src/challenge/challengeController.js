"use strict";
const { catchAsync } = require("../error");
const responseHandler = require("../handler");
const challengeModel = require("./challengeModel");

//admin
exports.getAllChallenges = catchAsync(async (req, res, next) => {
  const challenges = await challengeModel.selectAllChallenges();
  responseHandler.respond(
    { head: challenges[0], data: challenges },
    { sCode: 200, errCode: 404, errMessage: "No challenges found" },
    res,
    next
  );
});

exports.getChallenge = catchAsync(async (req, res, next) => {
  const challenge = await challengeModel.selectChallenge(req.params.id);
  responseHandler.respond(
    { head: challenge[0], data: challenge },
    { sCode: 200, errCode: 404, errMessage: "Challenge not found" },
    res,
    next
  );
});

exports.createChallenge = catchAsync(async (req, res, next) => {
  req.body.userId = req.userId;
  const newChallenge = await challengeModel.insertChallenge(req.body);
  responseHandler.respondEmpty(
    { head: newChallenge, data: newChallenge },
    { sCode: 201, errCode: 404, errMessage: "Operation failed" },
    res,
    next
  );
});

exports.modifyChallenge = catchAsync(async (req, res, next) => {
  if (
    !req.userAccess.permissions.includes("admin") &&
    !req.userAccess.createdChallenges.includes(req.params?.id)
  )
    return next(
      new AppError("You have no perrmision to perform this operation", 403)
    );
  const challenge = await challengeModel.updateChallenge(
    req.body,
    req.params.id
  );
  responseHandler.respondEmpty(
    { head: challenge, data: challenge },
    { sCode: 204, errCode: 404, errMessage: "Operation failed" },
    res,
    next
  );
});
