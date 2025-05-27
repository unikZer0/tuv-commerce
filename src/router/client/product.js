const express = require('express')
const router = express()
const Products = require('../../controller/product/productCtrl');
const verifyToken = require('../../controller/tokenhandle/verifyToken')
//category
router.post('/categories/',verifyToken,Products.getProducts);
router.post('/categories/:id',verifyToken,Products.getCategories);


//product 

router.post('/product/:id',verifyToken,Products.getProductCtrl);
//wishlist

router.post('/showWishlist',verifyToken,Products.showWishlist);
router.post('/insertWishlist',verifyToken,Products.insertWishlistCtrl);
router.post('/deleteWishlist/:id',verifyToken,Products.deletetWishlistCtrl);

//=======================order page
//address 

router.post('/address',verifyToken,Products.showAddressCtrl)
router.post('/insertaddress',verifyToken,Products.insertAddressCtrl)
//checkout 
router.post('/checkout',verifyToken,Products.checkoutCtrl)


module.exports = router
