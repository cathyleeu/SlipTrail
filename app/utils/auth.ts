import type { AuthErrorType } from '@types'

function parseAuthError(error: AuthErrorType): string {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 틀렸습니다'
  }
  if (message.includes('User already registered')) {
    return '이미 가입된 이메일입니다'
  }
  if (message.includes('Email rate limit exceeded')) {
    return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요'
  }
  if (message.includes('Email not confirmed')) {
    return '이메일 인증이 완료되지 않았습니다'
  }
  if (message.includes('Password should be at least')) {
    return '비밀번호는 최소 6자 이상이어야 합니다'
  }

  return '오류가 발생했습니다. 다시 시도해주세요'
}

export { parseAuthError }
