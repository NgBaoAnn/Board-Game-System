const HTTP_STATUS = require("../constants/http-status");
const uploadService = require("../services/upload.service");
const ResponseHandler = require("../utils/response-handler");

class UploadController {
  async uploadAvatar(req, res, next) {
    try {
      const response = await uploadService.uploadAvatar(req.file);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Upload avatar successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async uploadGameImage(req, res, next) {
    try {
      const response = await uploadService.uploadGameImage(req.file);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Upload game image successfully!",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UploadController();
