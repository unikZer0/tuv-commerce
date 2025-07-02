const express = require('express')
const router = express()
const checkoutCtrl = require('../../controller/product/checkoutCtrl');
const verifyToken = require('../../controller/tokenhandle/verifyToken')

router.post('/webhook',express.raw({ type: "application/json" }),checkoutCtrl.webhookCtrl)

module.exports = router
