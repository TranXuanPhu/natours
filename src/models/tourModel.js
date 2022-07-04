const mongoose = require('mongoose');
const slugify = require('slugify');
//const slug = require('mongoose-slug-generator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [50, 'Tên tour phải ít hơn 50 kí tự'],
    minlength: [10, 'Tên tour phải nhiều hơn 10 kí tự'],
  },
  slug: { type: String },
  duration: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: [true, 'Nhập difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficulty',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Đánh giá bắt dầu từ 1.0'],
    max: [5, 'Đánh giá phải thấp hơn 5.0'],
    set: (val) => Math.round(val * 10) / 10,
  },
  price: {
    type: Number,
    required: [true, 'tour phải có giá'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Nhập dữ liệu'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Chọn ảnh bìa'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  },
});

//mongoose.plugin(slug);

//NOTE: document middleware : run before save(), create(),
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, trim: true });
  next();
});

const tour = mongoose.model('Tour', tourSchema);
module.exports = tour;
