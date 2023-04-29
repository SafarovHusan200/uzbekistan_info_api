const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user.model");

// Protecting routes
exports.protected = asyncHandler(async (req, res, next) => {
  let token;

  // Authorization: <type> <credentials> Bearer adhliuegbysgbiybhsire
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorResponse("Not authorization to access this route", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

// Grand access to admins
exports.adminStatus = asyncHandler(async (req, res, next) => {
  if (!req.user.adminStatus) {
    return next(
      new ErrorResponse("This route can be access only admin status users", 403)
    );
  }

  next();
});

// Api Key access
exports.apiKeyAccess = asyncHandler(async (req, res, next) => {
  let key;
  // Check header for api key
  if (req.headers["apikey"]) {
    key = req.headers["apikey"];
  }

  if (!key) {
    return next(new ErrorResponse("No Api Key Access this route ", 403));
  }

  const user = await User.findOne({ apiKey: key });

  if (!user) {
    return next(new ErrorResponse("No user found by this Api Key", 400));
  }

  const oneReqApiCost = process.env.ONE_RES_API_COST;
  // isActive or payment oneResApiCost ✔
  if (!user.isActive) {
    if (user.balance < oneReqApiCost) {
      const needMoney = oneReqApiCost - user.balance;
      return next(
        new ErrorResponse(
          `Your balance is less than ${oneReqApiCost}, You need ${needMoney} more or Please activate your status to get response`,
          403
        )
      );
    }

    await User.findOneAndUpdate(
      { apiKey: key },
      {
        balance: user.balance - oneReqApiCost,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  next();
});
