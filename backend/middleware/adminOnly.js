module.exports = (req, res, next) => {
  // assume role_id = 1 is ADMIN
  if (req.user.role_id !== 1) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
