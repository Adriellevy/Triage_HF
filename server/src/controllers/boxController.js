import { BoxModel } from '../models/mysql/boxModel.js'

export class BoxController {
  static async getAllBoxes(req, res) {
    try {
      const boxes = await BoxModel.getAllBoxes()
      if (boxes) return res.json(boxes)
      return res.status(404).json({ message: 'boxes not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }

  static async getAvailableBoxes(req, res) {
    try {
      const boxes = await BoxModel.getAvailableBoxes()
      if (boxes) return res.json(boxes)
      return res.status(404).json({ message: 'boxes not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
