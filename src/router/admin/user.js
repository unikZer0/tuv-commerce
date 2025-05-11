const express = require('express')
const router = express()
const getUsers = require('../../adminCtrl/user/UserCtrl')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
const authorizeRole = require('../../middleware/authorizeRole')

router.post('/getusers/',verifyToken,authorizeRole(1,2),getUsers.getAllUsersCtrl);

module.exports = router
