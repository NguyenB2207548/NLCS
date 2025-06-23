const express = require('express');
const router = express.Router();
const adminContractController = require('../../controllers/admin/adminContractController');

router.get('/getAllContract', adminContractController.getAllContract);
router.get('/detail/:id', adminContractController.getContractOfUser);

module.exports = router;