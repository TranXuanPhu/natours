const express = require('express');
const router = express.Router();
const tourController = require('../app/controllers/tourController.js');

router.get('/create', tourController.create);
router.post('/create', tourController.createTour);

router.get('/:slug', tourController.getTour);

module.exports = router;
