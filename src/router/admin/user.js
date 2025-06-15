const express = require('express')
const router = express.Router()
const getUsers = require('../../adminCtrl/user/UserCtrl')
const verifyToken = require('../../controller/tokenhandle/verifyToken')
const authorizeRole = require('../../middleware/authorizeRole')

router.post('/getusers', verifyToken, authorizeRole(1,2), getUsers.getAllUsersCtrl);
router.post('/delete/:id', verifyToken, authorizeRole(1,2), getUsers.DeleteUsersCtrl);
router.post('/update/:id', verifyToken, authorizeRole(1,2), getUsers.UpdateUsersCtrl);

module.exports = router
