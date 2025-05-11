const express = require('express')
const router = express()
const getUsers = require('../../adminCtrl/user/UserCtrl')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
const authorizeRole = require('../../middleware/authorizeRole')

router.post('/getusers/',getUsers.getAllUsersCtrl);

module.exports = router
