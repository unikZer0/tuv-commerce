const express = require('express')
const router = express()
const Products = require('../controller/product/productCtrl');
const verifyToken = require('../controller/tokenhandle/verifyToken')

router.post('/getAll',verifyToken,Products.getProducts);
router.post('/getSports',verifyToken,Products.getSports);
router.post('/getWorks',verifyToken,Products.getWorks);
router.post('/getFasions',verifyToken,Products.getFasions);
router.post('/getHomes',verifyToken,Products.getHomes);
router.post('/getBoots',verifyToken,Products.getBoots);

module.exports = router
