export function requireBootstrapSecret(req, res, next) {
  const header = req.get('x-bootstrap-secret');
  const expected = process.env.BOOTSTRAP_SECRET;

  if (!expected) {
    return res.status(500).json({ message: 'BOOTSTRAP_SECRET not configured' });
  }

  if (!header || header !== expected) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}
