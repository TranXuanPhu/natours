const tourModel = require('../../models/tourModel.js');
const { multipleMongooseToObject } = require('../../utils/mongoose.js');
const authController = require('./authController.js');

exports.overView = async function (req, res, next) {
  tourModel
    .find({})
    .then((tours) => {
      res.render('home', {
        tours: multipleMongooseToObject(tours),
      });
    })
    .catch(next);
};

exports.signupForm = function (req, res, next) {
  res.render('user/signup');
};
exports.loginForm = function (req, res, next) {
  res.render('user/login');
};
exports.logout = function (req, res, next) {
  authController.logout(req, res);
  res.redirect('/');
};
