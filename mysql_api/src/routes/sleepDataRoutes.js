"use strict";
const express = require("express");
const router = express.Router();
const challengeController = require("../challenge");
const idValidator = require("../utils");

router
  .route("/")
  .get(challengeController.getAllChallenges)
  .post(challengeController.createChallenge);
