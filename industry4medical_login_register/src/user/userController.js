const { catchAsync, AppError } = require("../error");
const user = require("./userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const isValidToken = async (token) => {
  const decodedJwt = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decodedJwt.id;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user.username,
      daysSinceLastLogin: user.last_logged_in ?? "unknown",
    },
  });
};

const getUserPermissions = async (userId) => {
  const permissionData = await user.selectPermissionData(userId);

  const permissions = JSON.parse(permissionData[0].access).map((x) => x.id);
  const subscribedChallenges = permissionData[1]?.access
    ? JSON.parse(permissionData[1].access).map((x) => x.id)
    : [];
  const createdChallenges = permissionData[2]?.access
    ? JSON.parse(permissionData[2].access).map((x) => x.id)
    : [];
  const access = {
    permissions,
    subscribedChallenges,
    createdChallenges,
  };
  return access;
};

exports.login = catchAsync(async (req, res, next) => {
  const activeUser = await user.getUserByName(req.body.username);
  if (!activeUser) return next(new AppError("User not found", 404));
  if (!(await user.isCorrectPassword(req.body.password, activeUser.password)))
    return next(new AppError("Invalid credentials", 401));
  user.updateLastLogin(activeUser.user_id);
  createSendToken(activeUser, 200, res);
});

exports.register = catchAsync(async (req, res, next) => {
  const { affectedRows } = await user.createUser(req.body);
  const { user_id: userId } = await user.getUserByName(req.body.username);
  await user.grantPermission(userId, 3);
  if (!affectedRows) return next(new AppError("User registration fail", 500));
  res.status(201).json({
    message: "success",
    data: {
      newUser: affectedRows,
    },
  });
});

exports.verify = catchAsync(async (req, res, next) => {
  const userId = await isValidToken(req.body.token);
  if (!userId) return next(new AppError("Token invalid", 401));
  const access = req.body?.getAccess ? await getUserPermissions(userId) : 0;
  res.status(200).json({
    message: "success",
    data: {
      userId: userId,
      userAccess: access,
    },
  });
});
