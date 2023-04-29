const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // message for dev
  console.log(err.stack.red);

  res.status(err.statusCode || 5000).json({
    success: false,
    error: error.message || `Server error`,
  });
};

module.exports = errorHandler;
