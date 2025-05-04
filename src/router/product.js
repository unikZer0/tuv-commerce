const express = require('express')
const router = express()
const Products = require('../controller/product/productCtrl');
const verifyToken = require('../controller/tokenhandle/verifyToken')

//category
router.post('/category/getAll',verifyToken,Products.getProducts);
router.post('/category/getSports',verifyToken,Products.getSports);
router.post('/category/getWorks',verifyToken,Products.getWorks);
router.post('/category/getFasions',verifyToken,Products.getFasions);
router.post('/category/getHomes',verifyToken,Products.getHomes);
router.post('/category/getBoots',verifyToken,Products.getBoots);

//cart

router.post('/cart/insertCart',verifyToken,Products.insertCartCtrl);
router.post('/cart/deleteCart/:id',verifyToken,Products.deleteCartCtrl);

//wishlist 

router.post('/product/:id',verifyToken,Products.getProductCtrl);
//product 

router.post('/insertWishlist',verifyToken,Products.insertWishlistCtrl);
router.post('/deleteWishlist/:id',verifyToken,Products.deletetWishlistCtrl);
router.post('/showWishlist/:id',verifyToken,Products.showWishlist);

module.exports = router
