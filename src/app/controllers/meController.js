const assert = require('assert');
const userModel = require('../../models/userModel.js');
const imagesModel = require('../../models/imagesModel.js');
const validate = require('../middlewares/validate.js');
const { mongooseToObject } = require('../../utils/mongoose.js');
const authController = require('./authController.js');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    console.log('multerFilter: not file.mimetype.startsWith("image")');
    cb(null, false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// //single('photo'): photo is the name input form
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    console.log('Error resizeUserPhoto');
    next();
    return;
  }
  //console.log(req.file);
  const ext = req.file.mimetype.split('/')[1];
  const img = {
    name: req.file.filename,
    img: {
      data: fs.readFileSync(req.file.path),
      contentType: ext,
    },
  };
  fs.unlinkSync(req.file.path);

  imagesModel
    .create(img)
    .then((imgOutput) => {
      //   res.contentType(`image/${ext}`);
      //   res.send(imgOutput.img.data);
      // const image = {
      //   name: imgOutput.name,
      //   data: imgOutput.img.data.toString('base64'),
      //   contentType: imgOutput.img.contentType,
      // };
      userModel
        .findByIdAndUpdate(
          req.user._id,
          { photo: imgOutput.name },
          { runValidators: false }
        )
        .then((user) => {
          console.log('resizeUserPhoto:', imgOutput.name);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  next();
};

exports.meForm = (req, res, next) => {
  imagesModel
    .findOne({ name: req?.user?.photo })
    .then((imgResult) => {
      let image = undefined;
      if (imgResult) {
        image = {
          name: imgResult.name,
          data: imgResult.img.data.toString('base64'),
          contentType: imgResult.img.contentType,
        };
      }
      res.render('me/account', { image });
    })
    .catch((err) => {
      console.log(err);

      next();
    });
};

exports.updateMe = (req, res, next) => {};
