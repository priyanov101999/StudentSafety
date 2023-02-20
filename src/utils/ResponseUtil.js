export default class ResponseUtil {
  static success(data, status = 200, message, res) {
    return res.status(status).send({
      success: true,
      message,
      data,
    });
  }

  static failure(message, status = 422, res) {
    return res.status(status).send({
      error: true,
      message,
    });
  }
}
