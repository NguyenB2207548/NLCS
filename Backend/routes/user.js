const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', userController.getUser);
router.delete('/delete/:id', auth, admin, userController.deleteUser);
router.put('/restore/:id', auth, admin, userController.restoreUser);

module.exports = router;