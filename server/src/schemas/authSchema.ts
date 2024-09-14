import zod, { type SafeParseReturnType } from 'zod';

const authSchema = zod.object({
  user_name: zod.string({
    required_error: 'User_Name is required '
  }),
  user_password: zod.string({
    required_error: 'Password is required'
  })
});

export function validateAuth(input: unknown): SafeParseReturnType<
  {
    user_name: string;
    user_password: string;
  },
  {
    user_name: string;
    user_password: string;
  }
> {
  return authSchema.safeParse(input);
}
export function validateRefresh(input: unknown): SafeParseReturnType<
  {
    user_name: string;
  },
  {
    user_name: string;
  }
> {
  return authSchema.safeParse(input);
}
