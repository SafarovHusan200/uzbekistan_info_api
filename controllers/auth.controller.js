const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const uuid = require("uuid");

// @descr   Register new user
// @route   POST /api/v1/auth/register
// @Access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const apiKey = uuid.v4();

  const user = await User.create({
    name,
    email,
    password,
    apiKey,
  });

  const token = user.generateJwtToken();

  res.status(201).json({
    success: true,
    data: user,
    token,
  });
});

// @descr   Login user
// @route   POST /api/v1/auth/login
// @Access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Pease provide email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("Invalid Credetials", 401));
  }

  // Chech for password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const token = user.generateJwtToken();

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

// @descr   Get profile user
// @route   GET /api/v1/auth/profile
// @Access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @descr   Update profile user
// @route   PUT /api/v1/auth/update
// @Access  Public
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// @descr   Update password
// @route   PUT /api/v1/auth/updatepassword
// @Access  Public
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Old Passwort is incorrect", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = user.generateJwtToken();

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

// @descr   Payment Balance
// @route   PUT /api/v1/auth/paymentBalance
// @Access  Public
exports.paymentBalans = asyncHandler(async (req, res, next) => {
  // CLICK, PAYME
  const user = await User.findById(req.user._id);
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      balance: user.balance + req.body.payment,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updateUser,
  });
});

// @descr   Activate status
// @route   PUT /api/v1/auth/activate
// @Access  Public
exports.activateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const apiCost = process.env.API_COST;

  if (user.balance < apiCost) {
    let needMoney = apiCost - user.balance;
    return next(
      new ErrorResponse(
        `Your balance is less than ${apiCost}, You need ${needMoney} more`,
        400
      )
    );
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      balance: user.balance - apiCost,
      isActive: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Your profile successfully activated",
  });
});
