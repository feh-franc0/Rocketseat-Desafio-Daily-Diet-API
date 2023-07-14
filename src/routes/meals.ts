import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals').where('session_id', sessionId).select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { meals }
    },
  )

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dietFood: z.boolean(),
    })

    const { name, description, dietFood } = createMealsBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      dietFood,
      session_id: sessionId,
      created_at: Date.now(),
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const updateMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dietFood: z.boolean(),
      })

      const { name, description, dietFood } = updateMealsBodySchema.parse(
        request.body,
      )

      await knex('meals').where({ id }).update({
        name,
        description,
        dietFood,
      })

      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      await knex('meals').where({ id }).del()

      return reply.status(204).send()
    },
  )

  app.get('/metrics', async (request, reply) => {
    const meals = await knex('meals').orderBy('created_at')
    const totalCount: number = meals.length
    const dietCount: number = meals.filter((meal) => meal.dietFood).length
    const nonDietCount: number = meals.filter((meal) => !meal.dietFood).length

    let maxDietSequence: number = 0
    let currentDietSequence: number = 0
    let prevMealIsDiet: boolean | null = null

    for (const meal of meals) {
      if (meal.dietFood) {
        if (prevMealIsDiet === true) {
          currentDietSequence++
        } else {
          currentDietSequence = 1
        }
        prevMealIsDiet = true
      } else {
        prevMealIsDiet = false
        currentDietSequence = 0
      }

      if (currentDietSequence > maxDietSequence) {
        maxDietSequence = currentDietSequence
      }
    }

    return {
      totalCount,
      dietCount,
      nonDietCount,
      bestDietSequence: maxDietSequence,
    }
  })
}
