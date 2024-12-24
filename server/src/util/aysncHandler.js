class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
function asyncHandler(func) {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
}

export { asyncHandler, ApiError };
