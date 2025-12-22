import { rolesService } from './roles.service.js';

export const rolesController = {
  async create(req, res) {
    const out = await rolesService.create(req.body, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(201).json(out);
  },

  async update(req, res) {
    const { id } = req.params;
    const out = await rolesService.update(id, req.body, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(200).json(out);
  },

  async get(req, res) {
    const { id } = req.params;
    const out = await rolesService.get(id);
    return res.status(200).json(out);
  },

  async remove(req, res) {
    const { id } = req.params;
    await rolesService.remove(id, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(204).send();
  },

  async list(req, res) {
    const out = await rolesService.list(req.query);
    return res.status(200).json(out);
  },
};
