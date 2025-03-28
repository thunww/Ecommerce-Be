


const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');



// Payment routes
router.use(authMiddleware);
router.post('/payments', paymentController.createPayment);
router.get('/payments', paymentController.getPaymentHistory);
router.get('/payments/:id', paymentController.getPaymentById);

module.exports = router;