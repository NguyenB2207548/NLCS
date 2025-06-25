const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/auth')

router.get('/revenueByMonth', auth, statsController.revenueByMonth);

module.exports = router;