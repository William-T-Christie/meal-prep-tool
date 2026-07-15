import { describe, it, expect } from 'vitest'
import { successResponse, errorResponse } from '@/lib/api-response'

describe('successResponse', () => {
  it('returns data with null error', async () => {
    const res = successResponse({ id: '123', name: 'test' })
    const json = await res.json()
    expect(json.data).toEqual({ id: '123', name: 'test' })
    expect(json.error).toBeNull()
    expect(json.status).toBe(200)
  })

  it('supports custom status codes', async () => {
    const res = successResponse({ created: true }, 201)
    const json = await res.json()
    expect(json.status).toBe(201)
    expect(res.status).toBe(201)
  })
})

describe('errorResponse', () => {
  it('returns error with null data', async () => {
    const res = errorResponse('Something went wrong', 400)
    const json = await res.json()
    expect(json.data).toBeNull()
    expect(json.error).toBe('Something went wrong')
    expect(json.status).toBe(400)
  })

  it('defaults to 400 status', async () => {
    const res = errorResponse('Bad input')
    const json = await res.json()
    expect(json.status).toBe(400)
    expect(res.status).toBe(400)
  })
})
