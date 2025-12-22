import { permissionsService } from './permissions.service.js';

export const permissionsController = {
  async create(req, res) {
    const out = await permissionsService.create(req.body, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(201).json(out);
  },

  async update(req, res) {
    const { code } = req.params;
    const out = await permissionsService.update(code, req.body, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(200).json(out);
  },

  async get(req, res) {
    const { code } = req.params;
    const out = await permissionsService.get(code);
    return res.status(200).json(out);
  },

  async remove(req, res) {
    const { code } = req.params;
    await permissionsService.remove(code, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(204).send();
  },

  async list(req, res) {
    const out = await permissionsService.list(req.query);
    return res.status(200).json(out);
  },
};
