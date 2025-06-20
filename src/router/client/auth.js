const express = require('express')
const router = express()
const auth = require('../../controller/auth/auth')

router.post('/login',auth.loginCtrl)
router.post('/register',auth.regitserCtrl)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router
