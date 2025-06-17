const express = require('express');
const router = express.Router();
const rentalCarController = require('../controllers/rentalCarController');
const auth = require('../middleware/auth');

router.post('/:id', auth, rentalCarController.createRentalCar);
router.get('/getAll', rentalCarController.getContractAll);
router.get('/getOfUser', auth, rentalCarController.getContractOfUser);
router.post('/confirm/:id', auth, rentalCarController.confirmContract);
router.post('/reject/:id', auth, rentalCarController.rejectContract);
router.get('/getContractOwner', auth, rentalCarController.getContractOfOwner);

module.exports = router;