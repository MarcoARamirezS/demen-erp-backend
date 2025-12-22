import { auditService } from './audit.service.js';

export const auditController = {
  async list(req, res) {
    const out = await auditService.list(req.query);
    return res.status(200).json(out);
  },

  async get(req, res) {
    const { id } = req.params;
    const out = await auditService.get(id);
    return res.status(200).json(out);
  },
};
