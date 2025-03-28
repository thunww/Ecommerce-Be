
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Protected routes (cần xác thực)
router.use(authMiddleware);

// Cart routes
router.post('/cart', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.put('/cart/:id', cartController.updateCartItem);
router.delete('/cart/:id', cartController.removeFromCart);

module.exports = router;