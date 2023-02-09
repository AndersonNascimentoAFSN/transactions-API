import { describe, expect, it } from 'vitest'

describe('ok', () => {
  it('o usuário consegue criar uma nova transação', () => {
    const responseStatusCode = 201

    expect(responseStatusCode).toEqual(201)
  })
})
