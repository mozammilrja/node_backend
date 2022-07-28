
const logger = (res, req, next) => {
  req.hello = "hello world";
  console.log(
    `${res.method} ${res.protocol}://${res.get("host")}${res.originalUrl}`
  );
  next();
};


module.exports = logger 