

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const wishlistController = require('../controllers/wishlistController');
// Wishlist routes
router.use(authMiddleware);
router.post('/wishlist', wishlistController.addToWishlist);
router.get('/wishlist', wishlistController.getWishlist);
router.delete('/wishlist/:id', wishlistController.removeFromWishlist);

module.exports = router;