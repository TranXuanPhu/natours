const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const userModel = require('../../models/userModel.js');
const imagesModel = require('../../models/imagesModel.js');
const validate = require('../middlewares/validate.js');
const { mongooseToObject } = require('../../utils/mongoose.js');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createTokenInCookie = (user, req, res) => {
  const token = signToken(user._id.toString());
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });
  // Remove password from output
  user.password = undefined;
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    // verify token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    //  Check if user still exists
    const currentUser = await userModel
      .findById(decoded.id)
      .select('-password');
    if (!currentUser) {
      return next();
    }

    // Check if user changed password after the token was issued

    // THERE IS A LOGGED IN USER
    res.locals.user = mongooseToObject(currentUser);
    return next();
  }

  next();
};
exports.logout = (req, res) => {
  // res.cookie('jwt', 'logout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });
  res.clearCookie('jwt');
};
exports.protect = async (req, res, next) => {
  //  Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    // console.log(token);
  }
  if (!token) {
    return next();
  }
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  //  Check if user still exists
  const currentUser = await userModel.findById(decoded.id).select('-password');
  if (!currentUser) {
    return next();
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next();
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  const user = mongooseToObject(currentUser);
  req.user = user;
  res.locals.user = user;
  const image = await imagesModel.findOne({ name: user.photo });
  if (image) {
    res.locals.image = {
      name: image.name,
      data: image.img.data.toString('base64'),
      contentType: image.img.contentType,
    };
  }

  next();
};
