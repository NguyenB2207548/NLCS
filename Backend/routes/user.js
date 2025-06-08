const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUser);
router.delete('/delete/:id', userController.deleteUser);
router.put('/restore/:id', userController.restoreUser);

module.exports = router;