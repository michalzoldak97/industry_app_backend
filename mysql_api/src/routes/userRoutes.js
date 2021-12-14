"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../user");

router.get("/", userController.getAllUsers);

module.exports = router;
