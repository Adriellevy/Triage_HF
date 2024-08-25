import z from 'zod';
import { BoxStatus, BoxType } from '../interface/box';

// Esquema de validación para un box
const boxSchema = z.object({
  box_code: z.string(),
  box_type: z.nativeEnum(BoxType),
  box_status: z.nativeEnum(BoxStatus).optional(),
  box_time: z.string().optional(),
  patient_id: z.string().optional(),
  patient_name: z.string().optional()
});

type Box = z.infer<typeof boxSchema>;
type PartialBox = Partial<Box>;

// Validación completa del box
export function validateBox(input: unknown): z.SafeParseReturnType<unknown, Box> {
  return boxSchema.safeParse(input);
}

// Validación parcial del box
export function validatePartialBox(input: unknown): z.SafeParseReturnType<unknown, PartialBox> {
  return boxSchema.partial().safeParse(input);
}
