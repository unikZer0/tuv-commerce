const express = require('express')
const router = express()
const Products = require('../../controller/product/productCtrl');

router.post("/webhook",express.raw({ type: 'application/json' }),Products.webhookCtrl);

module.exports = router
