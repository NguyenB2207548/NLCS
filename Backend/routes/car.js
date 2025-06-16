const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', carController.getCar);
router.get('/:id', carController.getDetailsCar);
router.post('/addCar', auth, upload.single('image'), carController.addCar);
router.delete('/:id', auth, carController.deleteCar);
router.put('/:id', auth, carController.updateCar);

module.exports = router;