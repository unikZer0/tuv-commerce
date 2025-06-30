const express = require('express')
const router = express()
const checkouts = require('../../controller/product/checkoutCtrl');

router.post("/webhook",express.raw({ type: 'application/json' }),checkouts.webhookCtrl);

module.exports = router
