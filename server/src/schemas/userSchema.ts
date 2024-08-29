import zod, { z, type SafeParseReturnType } from 'zod';
import { UserRole } from '../interface/user';

const userSchema = zod.object({
  user_name: zod
    .string({
      required_error: 'Name is required '
    })
    .min(1)
    .max(50),
  user_email: zod
    .string({
      required_error: 'Email address is requires'
    })
    .email({ message: 'Invalid email address' })
    .toLowerCase(),
  user_password: zod
    .string({
      required_error: 'Password is required'
    })
    .min(6, 'Password is too short - should be min 6 chars'),
  user_password_confirmation: zod.string({
    required_error: 'Password confirmation is required'
  }),
  user_rol: zod.enum(['DOCTOR', 'NURSE', 'HOSPITAL'])
});

export function validateUser(input: unknown): SafeParseReturnType<
  {
    user_name: string;
    user_email: string;
    user_password: string;
    user_password_confirmation: string;
    user_rol: 'DOCTOR' | 'NURSE' | 'HOSPITAL';
  },
  {
    user_name: string;
    user_email: string;
    user_password: string;
    user_password_confirmation: string;
    user_rol: 'DOCTOR' | 'NURSE' | 'HOSPITAL';
  }
> {
  return userSchema.safeParse(input);
}

export function validatePartialUser(input: unknown): SafeParseReturnType<
  Partial<{
    user_name: string;
    user_email: string;
    user_password: string;
    user_password_confirmation: string;
    user_rol: 'DOCTOR' | 'NURSE' | 'HOSPITAL';
  }>,
  Partial<{
    user_name: string;
    user_email: string;
    user_password: string;
    user_password_confirmation: string;
    user_rol: 'DOCTOR' | 'NURSE' | 'HOSPITAL';
  }>
> {
  return userSchema.partial().safeParse(input);
}

// Definir un esquema específico para la actualización de usuarios
const userUpdateSchema = z.object({
  user_name: z.string().nonempty({ message: 'User name is required' }).optional(),
  user_password: z.string().optional(),
  user_full_name: z.string().nonempty({ message: 'Full name is required' }).optional(),
  user_rol: z.enum(['DOCTOR', 'NURSE', 'HOSPITAL']).optional(),
  user_specialization: z.string().nullable().optional(),
  user_cellphone: z.string().nullable().optional()
});

// Función para validar un objeto parcial de actualización de usuario
export function validatePartialUpdateUser(input: unknown): SafeParseReturnType<
  Partial<{
    user_name: string;
    user_password: string;
    user_full_name: string;
    user_rol: UserRole;
    user_specialization: string | null;
    user_cellphone: string | null;
  }>,
  Partial<{
    user_name: string;
    user_password: string;
    user_full_name: string;
    user_rol: 'DOCTOR' | 'NURSE' | 'HOSPITAL';
    user_specialization: string | null;
    user_cellphone: string | null;
  }>
> {
  return userUpdateSchema.safeParse(input);
}
