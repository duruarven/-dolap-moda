const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Erişim engellendi. Token bulunamadı.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Geçersiz token.' });
  }
};