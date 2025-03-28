const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const wishlistController = require('../controllers/wishlistController');
const reviewController = require('../controllers/reviewController');
const paymentController = require('../controllers/paymentController');
const notificationController = require('../controllers/notificationController');
const addressController = require('../controllers/addressController');

// Public routes (không cần xác thực)
router.get('/products', productController.getAllProducts);
router.get('/products/search', productController.searchProducts);
router.get('/products/:product_id', productController.getProductById);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/new-arrivals', productController.getNewArrivals);
router.get('/products/best-deals', productController.getBestDeals);
router.get('/products/:product_id/reviews', reviewController.getReviews);
router.get('/search/advanced', productController.advancedSearch);

// Protected routes (cần xác thực)
router.use(authMiddleware);

// Cart routes
router.post('/cart', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.put('/cart/:id', cartController.updateCartItem);
router.delete('/cart/:id', cartController.removeFromCart);

// Wishlist routes
router.post('/wishlist', wishlistController.addToWishlist);
router.get('/wishlist', wishlistController.getWishlist);
router.delete('/wishlist/:id', wishlistController.removeFromWishlist);

// Review routes
router.post('/products/:id/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

// Payment routes
router.post('/payments', paymentController.createPayment);
router.get('/payments', paymentController.getPaymentHistory);
router.get('/payments/:id', paymentController.getPaymentById);

// Notification routes
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/read-all', notificationController.markAllAsRead);

// Address routes
router.get('/addresses', addressController.getAddresses);
router.post('/addresses', addressController.addAddress);
router.put('/addresses/:id', addressController.updateAddress);
router.delete('/addresses/:id', addressController.deleteAddress);

module.exports = router; 