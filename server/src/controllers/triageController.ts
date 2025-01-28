import { Request, Response } from 'express';
import { TriageModel } from '../models/mysql/triageModel';
import { UserModel } from '../models/mysql/userModel';
import { UserRole } from '../interface/user';

export class TriageController {
  static async getAllTriage(req: Request, res: Response) {
    const triages = await TriageModel.findAll();
    if (triages.length > 0) {
      return res.status(200).json({ message: triages });
    } else {
      return res.status(404).json({ message: 'No se encontraron triages' });
    }
  }

  static async createNewTriage(req: any, res: Response) {
    const { level, color } = req.body;

    const userAdmin = await UserModel.getUserById(req.user.id);
    if (userAdmin?.user_type !== UserRole.HOSPITAL)
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });

    if (!level) return res.status(400).json({ message: 'El nivel de triage es requerido' });
    if (!color) return res.status(400).json({ message: 'El color es requerido' });

    if (!this.validateRgbColor(color))
      return res.status(400).json({ message: `El color debe tener el formato: '012,345,678'` });

    const triage = await TriageModel.findByLevel(level);

    if (triage)
      return res.status(400).json({ message: `Ya existe un triage con el nivel ${level}` });

    try {
      const newTriage = await TriageModel.create({ level, color });
      console.log(newTriage);
      return res.status(201).json({ message: newTriage });
    } catch (err) {
      return res.status(500).json({ message: `Error al crear el triage: ${err.message}` });
    }
  }

  static async updateTriage(req: any, res: Response) {
    const userAdmin = await UserModel.getUserById(req.user.id);
    if (userAdmin?.user_type !== UserRole.HOSPITAL)
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });

    const levelParam = req.params.id;
    const { color } = req.body;
    console.log('color', color);
    console.log('levelParam', levelParam);
    const level = await TriageModel.findByLevel(levelParam);
    if (!level)
      return res
        .status(404)
        .json({ message: `No se encontró un triage con el nivel ${levelParam}` });

    if (!color) return res.status(400).json({ message: 'El color es requerido' });
    if (!this.validateRgbColor(color))
      return res.status(400).json({ message: `El color debe tener el formato rgb: 'XXX,XXX,XXX'` });

    try {
      const updatedTriage = await TriageModel.update({ level: levelParam, color });
      return res.status(200).json({ message: updatedTriage });
    } catch (err) {
      return res.status(500).json({ message: `Error al actualizar el triage: ${err.message}` });
    }
  }

  static async deleteTriage(req: any, res: Response) {
    const userAdmin = await UserModel.getUserById(req.user.id);
    if (userAdmin?.user_type !== UserRole.HOSPITAL)
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });

    const levelParam = req.params.id;
    const level = await TriageModel.findByLevel(levelParam);
    if (!level)
      return res
        .status(404)
        .json({ message: `No se encontró un triage con el nivel ${levelParam}` });

    try {
      await TriageModel.delete(levelParam);
      return res.status(200).json({ message: `Triage con nivel ${levelParam} eliminado` });
    } catch (err) {
      return res.status(500).json({ message: `Error al eliminar el triage: ${err.message}` });
    }
  }

  private static validateRgbColor(color: string) {
    const rgbRegex = /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/;
    const [r, g, b] = color.split(',').map((c) => parseInt(c));
    return rgbRegex.test(color) && r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  }
}
