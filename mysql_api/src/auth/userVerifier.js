"use strict";

const { catchAsync, AppError } = require("../error");
const axios = require("axios");

exports.verify = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(new AppError("User Authorization failed", 401));
  const token = req.headers.authorization.split(" ")[1];
  const response = await axios
    .post(`http://login_register_api:8082/verify`, {
      token,
      getAccess: true,
    })
    .catch((err) => {
      return next(new AppError("User authentication failed", 401));
    });
  const userId = response.data.data.userId;
  if (!userId) return next(new AppError("Invalid user data", 401));
  req.userId = userId;
  req.userAccess = response.data.data?.userAccess;
  next();
});

const conditions = {
  isAdmin: function (req) {
    return req.userAccess.permissions.includes("admin");
  },
  isUser: function (req) {
    return req.userId == req.params.id;
  },
  createdChallenge: function (req) {
    return req.userAccess.createdChallenges.includes(+req.params?.challenge);
  },
  isSubscribed: function (req) {
    return (
      req.userAccess.subscribedChallenges.includes(+req.params?.challenge) &&
      req.userId == req.params.id
    );
  },
};

exports.verifyPermissions = (con) => {
  return (req, res, next) => {
    let shouldPass = false;
    for (let c of con) {
      if (conditions[c](req)) {
        shouldPass = true;
        break;
      }
    }
    if (shouldPass) next();
    else
      return next(
        new AppError("You have no perrmision to perform this operation", 403)
      );
  };
};
