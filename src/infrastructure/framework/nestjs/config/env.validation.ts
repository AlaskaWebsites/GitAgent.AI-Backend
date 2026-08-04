import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val))),
  REDIS_URL: z.string().min(1, { message: 'REDIS_URL obrigatório.' }),
  DATABASE_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error('Invalid environment variables: ' + parsed.error.message);
  }
  return parsed.data;
}
