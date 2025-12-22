import { usersService } from './users.service.js';

export const usersController = {
  async create(req, res) {
    const out = await usersService.create(req.body, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(201).json(out);
  },

  async update(req, res) {
    const { id } = req.params;
    const out = await usersService.update(id, req.body, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(200).json(out);
  },

  async get(req, res) {
    const { id } = req.params;
    const out = await usersService.get(id);
    return res.status(200).json(out);
  },

  async remove(req, res) {
    const { id } = req.params;
    await usersService.remove(id, req.user.id, {
      ip: req.ip,
      userAgent: req.get('user-agent') || null,
    });
    return res.status(204).send();
  },

  async list(req, res) {
    const out = await usersService.list(req.query);
    return res.status(200).json(out);
  },
};
