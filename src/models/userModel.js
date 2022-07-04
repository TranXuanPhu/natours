const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provied a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please tell us your passwords'],
    minlength: 8,
    selected: false, //FIXME: không show ra password khi query find...
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: [
      {
        validator: function (value) {
          // console.log('passwordConfirm check validate: ', value);
          return value === this.password;
        },
        message: 'Passwords are not the same!',
      },
    ],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//NOTE: middleware prev save user
userSchema.pre('save', async function (next) {
  //mật khẩu không có thay đổi
  console.log('password: ', this.isModified('password'));
  if (!this.isModified('password')) return next();
  //mã hóa hash password
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

//NOTE: time password change middleware
userSchema.pre('save', function (next) {
  if (!this.isModified('passwordConfirm') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//NOTE: // Equivalent to calling `pre()` on `find`, `findOne`, `findOneAndUpdate`.
userSchema.pre(/^find/, function (next) {
  // find all user active = true
  this.find({ active: { $ne: false } }).select('-__v');
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

const user = mongoose.model('users', userSchema);

module.exports = user;
