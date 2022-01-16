"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../user");
const verifier = require("../auth");

router.get("/", userController.getAllUsers);

router.route("/sleepdata").get(userController.getUserSleepData);

router.use("/:id", userController.isIdCorrect);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(
    verifier.verifyPermissions(["isAdmin", "isUser"]),
    userController.deleteUser
  );

router.route("/:id/challenges").get(userController.getUserChallenges);

router
  .route("/:id/challenge/:challenge")
  .get(
    verifier.verifyPermissions(["isAdmin", "createdChallenge", "isSubscribed"]),
    userController.getUserChallenge
  )
  .post(
    verifier.verifyPermissions(["isAdmin", "createdChallenge"]),
    userController.signUpUserChallenge
  )
  .delete(
    verifier.verifyPermissions(["isAdmin", "createdChallenge", "isSubscribed"]),
    userController.signOffUserChallenge
  )
  .put(
    verifier.verifyPermissions(["isAdmin", "isUser"]),
    userController.modifyUserChallenge
  );

module.exports = router;
