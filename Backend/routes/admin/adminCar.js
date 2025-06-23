const express = require('express');
const router = express.Router();
const adminCarController = require('../../controllers/admin/adminCarController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

router.get('/getAllCar', adminCarController.getAllCar);
router.get('/detail/:id', adminCarController.getCarOfUser);
router.delete('/delete/:id', auth, admin, adminCarController.deleteCar);

module.exports = router;