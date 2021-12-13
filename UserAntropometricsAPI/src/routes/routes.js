"use strict";
const express = require("express");
const router = express.Router();
const userDataHandler = require("../userdata");

router.post("/smartwatchdata", userDataHandler.handleSmartwatchData);

module.exports = router;
