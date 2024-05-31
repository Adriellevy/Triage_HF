import { BoxModel } from '../models/mysql/boxModel';
import { type Request, type Response } from 'express';
export class BoxController {
  static async getAllBoxes(req: Request, res: Response): Promise<Response> {
    try {
      const boxes = await BoxModel.getAllBoxes();
      if (boxes) return res.json(boxes);
      return res.status(404).json({ message: 'boxes not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getAvailableBoxes(req: Request, res: Response): Promise<Response> {
    try {
      const boxes = await BoxModel.getAvailableBoxes();
      if (boxes) return res.json(boxes);
      return res.status(404).json({ message: 'boxes not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }

  static async getBoxCodeById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const boxes = await BoxModel.getBoxCodeById(id);
      if (boxes) return res.json(boxes);
      return res.status(404).json({ message: 'boxes not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' });
    }
  }
}
