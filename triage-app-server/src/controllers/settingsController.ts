import { readFileSync } from 'fs';
import { type Request, type Response } from 'express';
const jsondata = JSON.parse(readFileSync('././data/TriageModels.json', 'utf8'));

export class SettingsController {
  static getSettings(req: Request, res: Response): void {
    try {
      const settings = jsondata;
      console.log(settings);
      if (settings) {
        res.json(settings);
      } else {
        res.status(404).json({ message: 'Settings not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Something goes wrong' });
    }
  }
}
