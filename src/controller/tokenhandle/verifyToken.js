// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');
const secret = 'mysecret'
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token,secret);

    // Attach to request so later middlewares can use it
    req.user = {
                id: decoded.userId,
                role:decoded.role
            }

    next();
    console.log(decoded);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
