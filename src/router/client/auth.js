const express = require('express')
const router = express()
const auth = require('../../controller/auth/auth')
const verifyToken = require('../../controller/tokenhandle/verifyToken')

router.post('/login',auth.loginCtrl)
router.post('/register',auth.regitserCtrl)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// User profile management routes
router.get('/profile', verifyToken, auth.getUserProfile)
router.put('/profile', verifyToken, auth.updateUserProfile)
router.delete('/profile', verifyToken, auth.deleteUserProfile)

// Change password route
router.put('/change-password', verifyToken, auth.changePassword)

module.exports = router
