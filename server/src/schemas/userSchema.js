import z from 'zod'

const userSchema = z.object({
  user_name: z.string({
    required_error: 'Name is required ',
  }),
  phone_number: z.string({
    required_error: 'Phone number is requires',
  }),
  email_address: z
    .string({
      required_error: 'Email address is requires',
    })
    .email({ message: 'Invalid email address' })
    .toLowerCase(),
})

export function validateUser(input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input)
}
