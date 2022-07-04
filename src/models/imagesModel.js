const mongoose = require('mongoose');
const fs = require('fs');

const imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: { type: String, default: 'jpeg' },
  },
});

imageSchema.methods.toBase64 = (file) => {
  const img = fs.readFileSync(req.file.path);
};

const image = mongoose.model('images', imageSchema);

module.exports = image;
