import { NextResponse } from 'next/server'

interface ApiSuccessResponse<T> {
  data: T
  error: null
  status: number
}

interface ApiErrorResponse {
  data: null
  error: string
  status: number
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, error: null, status }, { status })
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ data: null, error, status }, { status })
}
