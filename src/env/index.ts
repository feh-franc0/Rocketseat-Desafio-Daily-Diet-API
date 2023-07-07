import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

//* .parse faz uma validação e dispara um erro caso tenha inconsistência nas variáveis de ambiente
// export const env = envSchema.parse(process.env)

//* .safeParse faz uma validação e ão dispara um erro caso tenha inconsistência nas variáveis de ambiente
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
