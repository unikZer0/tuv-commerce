const express = require('express')
const router = express.Router()
const KPIsCtrl = require('../../adminCtrl/dashboard/KPIsCtrl')
const monthlyTarget = require('../../adminCtrl/dashboard/monthlyTatgetCtrl')
const monthlysales = require('../../adminCtrl/dashboard/chartCtrl')
const monthlystats = require('../../adminCtrl/dashboard/statisticCtrl')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
const authorizeRole = require('../../middleware/authorizeRole')
const activities = require('../../adminCtrl/dashboard/activityCtrl')

router.post('/kpisdata', verifyToken, authorizeRole(1,2), KPIsCtrl.dataKpisCtrl);
router.post('/monthlytarget', verifyToken, authorizeRole(1,2), monthlyTarget.monlthlyCtrl);
router.post('/monthlysales', verifyToken, authorizeRole(1,2), monthlysales.chartCtrl);
router.post('/monthlystats', verifyToken, authorizeRole(1,2), monthlystats.statisticCtrl);
router.post('/activities', verifyToken, authorizeRole(1,2), activities.activitiesCtrl);

module.exports = router
