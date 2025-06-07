const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getCar);
router.get('/:id', carController.getDetailsCar);

module.exports = router;