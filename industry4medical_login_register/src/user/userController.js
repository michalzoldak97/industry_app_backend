const { catchAsync, AppError } = require("../error");
const user = require("./userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  console.log(`user id: ${user.user_id}`);
  const token = signToken(user.user_id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user.username,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const activeUser = await user.getUserByName(req.body.username);
  if (!activeUser) return next(new AppError("User not found", 404));
  if (!(await user.isCorrectPassword(req.body.password, activeUser.password)))
    return next(new AppError("Invalid credentials", 401));
  createSendToken(activeUser, 200, res);
});

exports.register = catchAsync(async (req, res, next) => {
  const { affectedRows } = await user.createUser(req.body);
  if (!affectedRows) return next(new AppError("User registration fail", 500));
  res.status(201).json({
    message: "success",
    data: {
      newUser: affectedRows,
    },
  });
});
