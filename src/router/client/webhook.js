const express = require('express')
const router = express()
const Products = require('../../controller/product/productCtrl');
const verifyToken = require('../../controller/tokenhandle/verifyToken')

router.post('/webhook',express.raw({ type: "application/json" }),Products.stripeCtrl)

module.exports = router
