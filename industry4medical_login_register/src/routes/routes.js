const express = require("express");
const router = express.Router();

const { login, register, verify } = require("../user");

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 300000,
  max: 3,
  message:
    "Too many login attempts from this IP address. Please, try again in 5 minutes",
});

router.post("/login", loginLimiter, login);

router.post("/register", register);

router.post("/verify", verify);

module.exports = router;
