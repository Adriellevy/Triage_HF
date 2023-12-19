import zod from 'zod'

const userSchema = zod.object({
  user_name: zod
    .string({
      required_error: 'Name is required ',
    })
    .min(1)
    .max(50),
  user_email: zod
    .string({
      required_error: 'Email address is requires',
    })
    .email({ message: 'Invalid email address' })
    .toLowerCase(),
  user_password: zod
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password is too short - should be min 6 chars'),
  user_password_confirmation: zod.string({
    required_error: 'Password confirmation is required',
  }),
  user_rol: zod.enum(['DOCTOR', 'NURSE', 'HOSPITAL']),
})

export function validateUser(input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input)
}
