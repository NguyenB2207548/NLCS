const express = require('express');
const router = express.Router();
const payContractController = require('../controllers/payController');
const auth = require('../middleware/auth');

router.post('/:id', auth, payContractController.payContract);
router.get('/paidContract', auth, payContractController.getPaidContract);
router.get('/notPaidContract', auth, payContractController.getNotPaidContract);
router.delete('/deletePayment/:id', auth, payContractController.deletePayment);

module.exports = router;