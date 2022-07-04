const assert = require('assert');
const tourModel = require('../../models/tourModel.js');
const validate = require('../middlewares/validate.js');
const { mongooseToObject } = require('../../utils/mongoose.js');
//const

//[GET] /tour/create
exports.create = function (req, res, next) {
  //const body = req.body;
  // res.json(body);
  res.render('tour/create');
};
//[POST] /tour/create
exports.createTour = async function (req, res, next) {
  const newTour = new tourModel(req.body);
  const errorValidate = validate.errorMessageValidate(newTour);

  if (errorValidate) {
    res.locals.errors = errorValidate;
    res.render('tour/create');
    return;
  }

  //name exist
  const tour = await tourModel.findOne({ name: req.body.name });
  if (tour) {
    res.locals.errors = [{ name: 'Tên tour đã tồn tại' }];
    res.render('tour/create');
    return;
  }

  //create
  newTour
    .save()
    .then(() => res.redirect('/'))
    .catch(() => res.status(422).json({ error: 'lỗi post create' }));
};

//[GET] /tour/:slug
exports.getTour = function (req, res, next) {
  tourModel
    .findOne({ slug: req.params.slug })
    .then((tour) => {
      const tourTmp = mongooseToObject(tour);
      res.render('tour/slug', {
        tour: tourTmp,
        startDates: new Date(tourTmp.startDates[0]).toLocaleString('en-us', {
          month: 'long',
          year: 'numeric',
        }),
        descriptions: tourTmp.description.split('\\n'),
      });
    })
    .catch(next);
};
