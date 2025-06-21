const express = require('express');
const router = express.Router();
const adminUserContronlller = require('../../controllers/admin/adminUserController');
const auth = require('../../middleware/auth');

router.get('/getAllUser', adminUserContronlller.getAllUser);
router.get('/detail/:id', adminUserContronlller.getUser);
router.delete('/delete/:id', auth, adminUserContronlller.deleteUser);
// router.put('/restore/:id', adminUserContronlller.restoreUser);

module.exports = router;
