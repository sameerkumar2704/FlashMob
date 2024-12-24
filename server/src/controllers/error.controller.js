export const errorController = (error, req, res, next) => {
  console.log("callled");
  const status_code = error.status || 500;
  console.log(status_code);

  return res
    .status(status_code)
    .json({ status: "failed", message: error.message });
};
