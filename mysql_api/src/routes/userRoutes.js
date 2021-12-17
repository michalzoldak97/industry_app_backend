"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../user");

router.get("/", userController.getAllUsers);

router.use("/:id", userController.isIdCorrect);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route("/:id/challenges").get(userController.getUserChallenges);

router
  .route("/:id/challenge/:challenge")
  .get(userController.getUserChallenge)
  .post(userController.signUpUserChallenge);

module.exports = router;
