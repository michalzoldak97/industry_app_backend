"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../user");

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUser);

module.exports = router;
