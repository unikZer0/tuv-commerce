const express = require('express')
const router = express()
const Products = require('../controller/product/productCtrl');
const verifyToken = require('../controller/tokenhandle/verifyToken')

//category
router.post('/categories/',verifyToken,Products.getProducts);
router.post('/categories/:id',verifyToken,Products.getCategories);

//cart

router.post('/cart/insertCart',verifyToken,Products.insertCartCtrl);
router.post('/cart/deleteCart/:id',verifyToken,Products.deleteCartCtrl);

 //product 

router.post('/product/:id',verifyToken,Products.getProductCtrl);
//wishlist

router.post('/showWishlist/:id',verifyToken,Products.showWishlist);
router.post('/insertWishlist',verifyToken,Products.insertWishlistCtrl);
router.post('/deleteWishlist/:id',verifyToken,Products.deletetWishlistCtrl);


module.exports = router
