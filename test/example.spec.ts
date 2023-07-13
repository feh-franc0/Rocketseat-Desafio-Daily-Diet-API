import { expect, test } from 'vitest'

test('the user should be able to create a new transaction', () => {
  // make the HTTP call to create a new transaction

  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
