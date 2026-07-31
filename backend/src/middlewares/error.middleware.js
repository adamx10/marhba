const errorMiddleware = (err, req, res, next) => {
  console.error(err);
 
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Something went wrong, please try again";
 
  return res.status(statusCode).json({ message });
};
 
export default errorMiddleware;