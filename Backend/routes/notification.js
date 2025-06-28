const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, notificationController.getNotifications);
router.get('/unread', auth, notificationController.getUnreadNotifications);
router.put('/markRead', auth, notificationController.markRead);

module.exports = router;