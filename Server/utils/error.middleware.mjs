const customErrorMiddleWare = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({ Gagal_Diproses: err.message });
};

export default customErrorMiddleWare;
