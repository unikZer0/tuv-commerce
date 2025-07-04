const express = require('express')
const router = express()
const categories = require('../../controller/product/categoryCtrl')
const wishlists = require('../../controller/product/wishlistCtrl')
const addresses = require('../../controller/product/addressCtrl')
const checkouts = require('../../controller/product/checkoutCtrl')
const Products = require('../../controller/product/productCtrl');
const ProductsSearch = require('../../controller/product/search')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
//category
router.post('/categories/',verifyToken,categories.getProducts);
router.post('/categories/:id',verifyToken,categories.getCategories);

// Get product types and brands dynamically
router.get('/product-types',verifyToken,categories.getProductTypes);
router.get('/brands',verifyToken,categories.getBrands);

//product 
router.post('/product/:id',verifyToken,Products.getProductCtrl);
router.post('/searchproducts',verifyToken,ProductsSearch.searchProducts);
// Popular & Latest products
router.get('/products/popular', verifyToken, Products.getPopularProducts);
router.get('/products/latest', verifyToken, Products.getLatestProducts);
//wishlist

router.post('/showWishlist',verifyToken,wishlists.showWishlist);
router.post('/insertWishlist',verifyToken,wishlists.insertWishlistCtrl);
router.post('/deleteWishlist/:id',verifyToken,wishlists.deletetWishlistCtrl);

//=======================order page
//address 

router.post('/address',verifyToken,addresses.showAddressCtrl)
router.post('/insertaddress',verifyToken,addresses.insertAddressCtrl)
router.post('/editaddress/:id',verifyToken,addresses.editAddressCtrl)
router.delete('/address/:id',verifyToken,addresses.deleteAddressCtrl)
//checkout 
router.post('/checkout',verifyToken,checkouts.checkoutCtrl)

// orders management
router.get('/orders',verifyToken,checkouts.getUserOrders)
router.get('/order/:orderId',verifyToken,checkouts.checkOrderStatus)
router.post('/order/:orderId/repay',verifyToken,checkouts.repayOrder)
router.post('/order/:orderId/cancel',verifyToken,checkouts.cancelOrder)
router.get('/order/:orderId/timeline',verifyToken,checkouts.getShippingTimeline)

//======================= REVIEWS =======================
// Get all reviews for a product
router.get('/reviews/:productId', verifyToken, Products.getProductReviews);

// Get review summary for a product (average rating, total count, rating breakdown)
router.get('/reviews/:productId/summary', verifyToken, Products.getReviewSummary);

// Get user's review for a specific product
router.get('/reviews/:productId/user', verifyToken, Products.getUserReview);

// Add or update a review
router.post('/reviews', verifyToken, Products.addOrUpdateReview);

// Delete user's review
router.delete('/reviews/:productId', verifyToken, Products.deleteUserReview);

module.exports = router
