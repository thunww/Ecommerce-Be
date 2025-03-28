
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Protected routes (cần xác thực)
router.use(authMiddleware);

// Cart routes
router.post('/', cartController.addToCart);
router.get('/', cartController.getCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);

module.exports = router;