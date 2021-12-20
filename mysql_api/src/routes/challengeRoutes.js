"use strict";
const express = require("express");
const router = express.Router();
const challengeController = require("../challenge");
const idValidator = require("../utils");

router
  .route("/")
  .get(challengeController.getAllChallenges)
  .post(challengeController.createChallenge);

router.use("/:id", idValidator.isIdCorrect);

router
  .route("/:id")
  .get(challengeController.getChallenge)
  .put(challengeController.modifyChallenge);

module.exports = router;
