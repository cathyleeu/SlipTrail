import { NextResponse } from 'next/server'

type ApiErrorOptions = {
  status?: number
  details?: unknown
  code?: string
}

export function apiError(message: string, options: ApiErrorOptions = {}) {
  const { status = 500, code, details } = options

  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
      details,
    },
    { status }
  )
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  )
}
