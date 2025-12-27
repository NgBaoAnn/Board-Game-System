class ErrorHandler {
  static handle(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
      success: false,
      status,
      message,
      error: err.errors || null,
    });
  }
}

module.exports = ErrorHandler;
