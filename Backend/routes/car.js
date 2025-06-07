const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');

router.get('/', carController.getCar);
router.get('/:id', carController.getDetailsCar);
router.post('/', auth, carController.addCar);

module.exports = router;