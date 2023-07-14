import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meals', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'hamburguer',
        description: 'x-tudo',
        dietFood: false,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealsResponde = await request(app.server).post('/meals').send({
      name: 'hamburguer',
      description: 'x-tudo',
      dietFood: false,
    })

    const cookies = createMealsResponde.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'hamburguer',
        description: 'x-tudo',
        dietFood: 0,
      }),
    ])
  })

  it('should be able to get a specific meals', async () => {
    const createMealsResponde = await request(app.server).post('/meals').send({
      name: 'hamburguer',
      description: 'x-tudo',
      dietFood: false,
    })

    const cookies = createMealsResponde.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealsId = listMealsResponse.body.meals[0].id

    const getMealsResponse = await request(app.server)
      .get(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealsResponse.body.meals).toEqual(
      expect.objectContaining({
        name: 'hamburguer',
        description: 'x-tudo',
        dietFood: 0,
      }),
    )
  })

  it('should be able to update a meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Old meal',
      description: 'Not so tasty',
      dietFood: false,
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'New meal',
        description: 'Delicious meal',
        dietFood: true,
      })
      .expect(200)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meals).toEqual(
      expect.objectContaining({
        name: 'New meal',
        description: 'Delicious meal',
        dietFood: 1,
      }),
    )
  })

  it('should be able to delete a meal', async () => {
    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Meal to be deleted',
      description: 'Not so important',
      dietFood: false,
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it.only('should be able to get metrics about meals', async () => {
    await request(app.server).post('/meals').send({
      name: 'Meal 1',
      description: 'Description 1',
      dietFood: true,
    })

    await request(app.server).post('/meals').send({
      name: 'Meal 2',
      description: 'Description 2',
      dietFood: true,
    })

    const createMealResponse = await request(app.server).post('/meals').send({
      name: 'Meal 3',
      description: 'Description 3',
      dietFood: false,
    })

    const cookies = createMealResponse.get('Set-Cookie')

    const response = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(response.body.totalCount).toBe(3)
    expect(response.body.dietCount).toBe(2)
    expect(response.body.nonDietCount).toBe(1)
    // Add assertions for bestDietSequence
  })
})
