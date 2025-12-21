export type HttpSuccess<T> = {
  ok: true
  status: number
  data: T
}

export type HttpFailure = {
  ok: false
  status: number
  error: string
  details?: unknown
}

export type HttpResult<T> = HttpSuccess<T> | HttpFailure

export type HttpErrorLike = {
  error?: unknown
  details?: unknown
}
