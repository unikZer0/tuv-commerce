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

//product 

router.post('/product/:id',verifyToken,Products.getProductCtrl);
router.post('/searchproducts',verifyToken,ProductsSearch.searchProducts);
//wishlist

router.post('/showWishlist',verifyToken,wishlists.showWishlist);
router.post('/insertWishlist',verifyToken,wishlists.insertWishlistCtrl);
router.post('/deleteWishlist/:id',verifyToken,wishlists.deletetWishlistCtrl);

//=======================order page
//address 

router.post('/address',verifyToken,addresses.showAddressCtrl)
router.post('/insertaddress',verifyToken,addresses.insertAddressCtrl)
router.post('/editaddress/:id',verifyToken,addresses.editAddressCtrl)
//checkout 
router.post('/checkout',verifyToken,checkouts.checkoutCtrl)


module.exports = router
