class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
function asyncHandler(func) {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      res.status(err.status).json({ status: "failed", message: err.message });
      return;
    });
  };
}

export { asyncHandler, ApiError };
