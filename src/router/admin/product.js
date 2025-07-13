const express = require('express');
const router = express.Router();
const adminProduct = require('../../adminCtrl/admin_Product/adminCtrlProduct');
const adminNotifications = require('../../adminCtrl/admin_Product/adminNotificationCtrl');
const verifyToken = require('../../controller/tokenhandle/verifyToken');
const authorizeRole = require('../../middleware/authorizeRole');


router.post('/products', verifyToken, authorizeRole(1,2,4), adminProduct.getAllProductsCtrl);
router.post('/products/create', verifyToken, authorizeRole(1,2,4), adminProduct.createProductCtrl);
router.get('/products/:id', verifyToken, authorizeRole(1,2,4), adminProduct.getProductByIdCtrl);
router.put('/products/:id', verifyToken, authorizeRole(1,2,4), adminProduct.updateProductCtrl);
router.delete('/products/:id', verifyToken, authorizeRole(1,2,4), adminProduct.deleteProductCtrl);
router.get('/products/search', verifyToken, authorizeRole(1,2,4), adminProduct.searchProductsByNameCtrl);
router.get('/products/searchByPrice', verifyToken, authorizeRole(1,2,4), adminProduct.searchProductsByPriceRangeCtrl);
router.get('/product-types', verifyToken, authorizeRole(1,2,4), adminProduct.getAllProductTypesCtrl);

//======================= ADMIN NOTIFICATIONS =======================
// Create notification for a specific user
router.post('/notifications/user', verifyToken, authorizeRole(1,2,4), adminNotifications.createNotificationForUser);

// Create notification for all users (broadcast)
router.post('/notifications/broadcast', verifyToken, authorizeRole(1,2,4), adminNotifications.createNotificationForAllUsers);

// Get all notifications (admin view)
router.get('/notifications', verifyToken, authorizeRole(1,2,4), adminNotifications.getAllNotifications);

// Get notifications for a specific user (admin view)
router.get('/notifications/user/:userId', verifyToken, authorizeRole(1,2,4), adminNotifications.getUserNotificationsAdmin);

// Delete notification (admin)
router.delete('/notifications/:notificationId', verifyToken, authorizeRole(1,2,4), adminNotifications.deleteNotificationAdmin);

// Get notification statistics
router.get('/notifications/stats', verifyToken, authorizeRole(1,2,4), adminNotifications.getNotificationStats);

// Mark notification as read (admin override)
router.put('/notifications/:notificationId/read', verifyToken, authorizeRole(1,2,4), adminNotifications.markNotificationAsReadAdmin);

// TODO: Add route for search by product type

module.exports = router;
