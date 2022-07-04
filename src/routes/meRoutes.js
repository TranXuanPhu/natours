const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/meController.js');

router.patch(
  '/updateMe',
  meController.uploadUserPhoto,
  meController.resizeUserPhoto,
  meController.meForm
);

router.get('/', meController.meForm);
module.exports = router;
