"use strict";
const express = require("express");
const router = express.Router();
const sleepDataController = require("../sleepdata");

router.route("/").get(sleepDataController.getClassifiedData);

module.exports = router;
