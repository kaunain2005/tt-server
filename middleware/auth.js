const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;   // { uid: 'firebase-uid', iat, exp }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
