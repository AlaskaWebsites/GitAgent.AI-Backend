import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional(),
  REDIS_URL: z.string().min(1, { message: 'REDIS_URL obrigatório.' }),
  DATABASE_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse({ ...config } as Record<string, unknown>);
  if (!parsed.success) {
    throw new Error('Invalid environment variables: ' + parsed.error.message);
  }
  // Normalize PORT to number if present
  const data = parsed.data;
  const result: Partial<Env> & { PORT?: number } = { ...data } as Partial<Env>;
  if (data.PORT !== undefined) {
    const n = parseInt(data.PORT, 10);
    if (Number.isNaN(n)) throw new Error('PORT must be a number');
    result.PORT = n;
  }
  return result as Env;
}
