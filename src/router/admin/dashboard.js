const express = require('express')
const router = express.Router()
const KPIsCtrl = require('../../adminCtrl/dashboard/KPIsCtrl')
const monthlyTarget = require('../../adminCtrl/dashboard/monthlyTatgetCtrl')
const monthlysales = require('../../adminCtrl/dashboard/chartCtrl')
const monthlystats = require('../../adminCtrl/dashboard/statisticCtrl')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
const authorizeRole = require('../../middleware/authorizeRole')

router.post('/kpisdata', verifyToken, authorizeRole(1,2,4), KPIsCtrl.dataKpisCtrl);
router.post('/monthlytarget', verifyToken, authorizeRole(1,2,4), monthlyTarget.monlthlyCtrl);
router.post('/monthlysales', verifyToken, authorizeRole(1,2,4), monthlysales.chartCtrl);
router.post('/monthlystats', verifyToken, authorizeRole(1,2,4), monthlystats.statisticCtrl);

module.exports = router
