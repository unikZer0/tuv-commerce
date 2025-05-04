const jwt = require ('jsonwebtoken')
const {errMessage,sucMessage} = require('../../service/messages')
// require('dotenv').config()
const secret = 'mysecret'
// const verifyToken = (req , res , next) =>{
//     const token = req.cookies.token;
//         if(!token)  {
//            return res.status(401).json({message:errMessage.errJWT})
//         }
//         jwt.verify(token,secret,(err,user)=>{
//             if (err) return res.status(403).json({ message: 'Invalid access token' });
//             req.user = user;
//                 next();
//             })
            
// }

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: errMessage.errJWT || 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid access token' });
        req.user = user;
        next();
    });
}
module.exports = verifyToken;
