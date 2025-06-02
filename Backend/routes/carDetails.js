const express = require('express');
const router = express.Router();
const carDetailsController = require('../controllers/carDetailsController');

router.get('/:id', carDetailsController.getDetailsCar);

module.exports = router;