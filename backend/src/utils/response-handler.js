class ResponseHandler {
  static success(res, { status = 200, message = "Success", data = null } = {}) {
    return res.status(status).json({
      success: true,
      status,
      message,
      data,
    });
  }
  static error(res, { status = 500, message = "Failed", data = null } = {}) {
    return res.status(status).json({
      success: false,
      status,
      message,
      data,
    });
  }
}

module.exports = ResponseHandler;
