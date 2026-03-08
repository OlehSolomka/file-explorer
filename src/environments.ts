import { z } from 'zod';

const EnvironmentSchema = z.object({});

const result = EnvironmentSchema.safeParse(import.meta.env);

if (!result.success) {
  console.error('Invalid environment variables:', z.treeifyError(result.error));
  throw new Error('Invalid environment variables');
}

export const environment = result.data;
