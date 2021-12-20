"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../user");

router.get("/", userController.getAllUsers);

router.route("/sleepdata").get(userController.getUserSleepData);

router.use("/:id", userController.isIdCorrect);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route("/:id/challenges").get(userController.getUserChallenges);

router
  .route("/:id/challenge/:challenge")
  .get(userController.getUserChallenge)
  .post(userController.signUpUserChallenge)
  .delete(userController.signOffUserChallenge)
  .put(userController.modifyUserChallenge);

module.exports = router;
