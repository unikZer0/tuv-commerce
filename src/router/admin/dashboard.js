const express = require('express')
const router = express.Router()
const KPIsCtrl = require('../../adminCtrl/dashboard/KPIsCtrl')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
const authorizeRole = require('../../middleware/authorizeRole')

router.post('/kpisdata', verifyToken, authorizeRole(1,2), KPIsCtrl.dataKpisCtrl);

module.exports = router
