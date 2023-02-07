import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return {
      transactions,
      total: transactions.length,
    }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.get('/:id', async (request, response) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where({ id }).first()

    if (!transaction) {
      return response
        .code(404)
        .send({ code: 404, message: 'transaction not found' })
    }

    return { transaction }
  })

  app.delete('/:id', async (request, response) => {
    const deleteTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = deleteTransactionParamsSchema.parse(request.params)

    await knex('transactions').where({ id }).delete()

    return response.code(204).send()
  })

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return response.status(201).send()
  })
}
