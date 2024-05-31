import { z } from 'zod';

const envVars = z.object({
  PORTAPI: z.string(),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PORT: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});

envVars.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}
