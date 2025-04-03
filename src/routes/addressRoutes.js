const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const addressController = require('../controllers/addressController');
// Address routes
router.use(authMiddleware);
router.get('/addresses', addressController.getAddresses);
router.post('/addresses', addressController.addAddress);
router.put('/addresses/:id', addressController.updateAddress);
router.delete('/addresses/:id', addressController.deleteAddress);

module.exports = router; 