export function requirePermissions(required = []) {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];

    const hasAll = required.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAll) {
      return res.status(403).json({
        message: 'Forbidden – insufficient permissions',
      });
    }

    next();
  };
}
