"use strict";
const express = require("express");
const router = express.Router();
const challengeController = require("../challenge");
const idValidator = require("../utils");
const verifier = require("../auth");

router
  .route("/")
  .get(challengeController.getAllChallenges)
  .post(challengeController.createChallenge);

router.use("/:id", idValidator.isIdCorrect);

router
  .route("/:id")
  .get(challengeController.getChallenge)
  .put(
    verifier.verifyPermissions(["isAdmin", "createdChallenge"]),
    challengeController.modifyChallenge
  );

module.exports = router;
