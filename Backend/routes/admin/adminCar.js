const express = require('express');
const router = express.Router();
const adminCarController = require('../../controllers/admin/adminCarController');

router.get('/getAllCar', adminCarController.getAllCar);

module.exports = router;