import type { AuthError } from '@supabase/supabase-js'

export type AuthErrorType = AuthError | Error | string | null

export type AuthResult = {
  success: boolean
  error: string | null
}
