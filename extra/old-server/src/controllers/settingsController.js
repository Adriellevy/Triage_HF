import { readFileSync } from 'fs'

const jsondata = JSON.parse(readFileSync('././data/TriageModels.json', 'utf8'))

export class SettingsController {
  static async getSettings(req, res) {
    try {
      const settings = jsondata
      if (settings) return res.json(settings)
      return res.status(404).json({ message: 'settings not found' })
    } catch (error) {
      return res.status(500).json({ message: 'Something goes wrong' })
    }
  }
}
