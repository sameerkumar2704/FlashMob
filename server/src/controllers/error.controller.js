export const errorController = (err, req, res, _) => {
  res.status(err.status).json({ status: "failed", message: err.message });
  return;
};
