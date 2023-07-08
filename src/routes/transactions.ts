import { FastifyInstance } from 'fastify'
import knex from 'knex'
import crypto from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
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
}
