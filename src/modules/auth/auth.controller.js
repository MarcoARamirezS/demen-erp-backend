import { authService } from './auth.service.js';

export const authController = {
  async bootstrap(req, res) {
    const ip = req.ip;
    const userAgent = req.get('user-agent') || null;
    console.log('@@@ req => ', req)
    const out = await authService.bootstrapFirstAdmin(req.body, { ip, userAgent });
    return res.status(201).json(out);
  },

  async login(req, res) {
    const ip = req.ip;
    const userAgent = req.get('user-agent') || null;

    const tokens = await authService.login(req.body, { ip, userAgent });
    return res.status(200).json(tokens);
  },

  async refresh(req, res) {
    const ip = req.ip;
    const userAgent = req.get('user-agent') || null;

    const tokens = await authService.refresh(req.body, { ip, userAgent });
    return res.status(200).json(tokens);
  },

  async logout(req, res) {
    const ip = req.ip;
    const userAgent = req.get('user-agent') || null;

    await authService.logout(req.body, { ip, userAgent });
    return res.status(204).send();
  },

  async me(req, res) {
    return res.status(200).json({
      id: req.user.id,
      permissions: req.user.permissions,
    });
  }
};
