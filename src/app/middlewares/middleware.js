exports.setLocal = function (req, res, next) {
  res.locals.errors = {};
  res.locals.user = undefined;
  next();
};
