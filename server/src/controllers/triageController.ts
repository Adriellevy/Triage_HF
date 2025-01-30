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
    const { color, newLevel } = req.body;
    const level = await TriageModel.findByLevel(levelParam);
    if (!level)
      return res
        .status(404)
        .json({ message: `No se encontró un triage con el nivel ${levelParam}` });
    const existLevel = await TriageModel.findByLevel(newLevel);
    if (existLevel && newLevel !== levelParam)
      return res.status(400).json({ message: `Ya existe un triage con el nivel ${newLevel}` });
    if (!color) return res.status(400).json({ message: 'El color es requerido' });
    if (!this.validateRgbColor(color))
      return res.status(400).json({ message: `El color debe tener el formato rgb: 'XXX,XXX,XXX'` });

    try {
      const updatedTriage = await TriageModel.update({ level: newLevel, color }, levelParam);
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

  static async sortTriageLevels(req: Request, res: Response) {
    const triages = req.body.triages;

    if (!triages || triages.length === 0) {
      return res
        .status(400)
        .json({ message: 'El arreglo con triages es requerido y no puede estar vacío.' });
    }

    try {
      const existingTriages = await TriageModel.getAllTriagesInAscendentOrderById();

      if (existingTriages.length !== triages.length) {
        return res.status(400).json({
          message:
            'El número de triages recibidos no coincide con los existentes en la base de datos.'
        });
      }

      // Paso 1: Actualizar valores temporalmente (niveles cortos)
      for (let i = 0; i < existingTriages.length; i++) {
        const currentTriage = existingTriages[i];
        const tempLevel = `_${i + 1}`; // Valores temporales cortos (ejemplo: "_1", "_2")

        await TriageModel.updateById(currentTriage.id, {
          level: tempLevel,
          color: triages[i].color
        });
      }

      // Paso 2: Actualizar los valores finales
      for (let i = 0; i < existingTriages.length; i++) {
        const currentTriage = existingTriages[i];
        const finalLevel = triages[i].level;

        await TriageModel.updateById(currentTriage.id, {
          level: finalLevel,
          color: triages[i].color
        });
      }

      return res.status(200).json({ message: 'Triages ordenados y actualizados correctamente.' });
    } catch (err) {
      console.error(`Error al ordenar los triages: ${err.message}`);
      return res.status(500).json({ message: `Error al ordenar los triages: ${err.message}` });
    }
  }

  private static validateRgbColor(color: string) {
    const rgbRegex = /^(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})$/;
    const [r, g, b] = color.split(',').map((c) => parseInt(c));
    return rgbRegex.test(color) && r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  }
}
