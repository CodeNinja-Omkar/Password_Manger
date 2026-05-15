const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Token is sent in HttpOnly cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user payload to the request
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
