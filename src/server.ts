import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

app.get('/api', async () => {
  // const tables = await knex('sqlite_schema').select('*')
  // return tables

  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de test',
      amount: 1000,
    })
    .returning('*')
  return transaction

  // const transactions = await knex('transactions').select('*')
  // return transactions

  // const transactions = await knex('transactions')
  //   .where('amount', 1000)
  //   .select('*')
  // return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server Running!')
  })
