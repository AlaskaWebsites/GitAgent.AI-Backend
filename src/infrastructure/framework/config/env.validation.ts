import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional(),
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, any>): Env {
  const parsed = envSchema.safeParse({ ...config });
  if (!parsed.success) {
    throw new Error('Invalid environment variables: ' + parsed.error.message);
  }
  // Normalize PORT to number if present
  const result = { ...parsed.data } as any;
  if (result.PORT !== undefined) {
    const n = parseInt(String(result.PORT), 10);
    if (Number.isNaN(n)) throw new Error('PORT must be a number');
    result.PORT = n;
  }
  return result as Env;
}
