const assert = require('assert');
const userModel = require('../../models/userModel.js');
const validate = require('../middlewares/validate.js');
const { mongooseToObject } = require('../../utils/mongoose.js');
const authController = require('./authController.js');

exports.signup = (req, res, next) => {
  //console.log(req.body);
  const newUser = userModel
    .create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    })
    .then((user) => {
      authController.createTokenInCookie(user, req, res);
      res.redirect('/');
      //res.json(res.cookie);
    })
    .catch((err) => res.json(err));
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  // 1) Check if email and password exist
  if (!email || !password) {
    return next();
  }
  // 2) Check if user exists && password is correct
  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next();
  }

  // 3) If everything ok, send token to client
  authController.createTokenInCookie(user, req, res);
  res.redirect('/');
};
