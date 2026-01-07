import { apiError, apiSuccess } from '@lib/apiResponse'
import { requireAuth } from '@lib/auth'
import { supabaseServer } from '@lib/supabase/server'

export async function PATCH(req: Request) {
  const supabase = await supabaseServer()
  const auth = await requireAuth(supabase)
  if (!auth.ok) return auth.response

  const { display_name } = await req.json()

  const { error } = await supabase.from('profiles').update({ display_name }).eq('id', auth.user.id)

  if (error) return apiError(error.message, { status: 400 })
  // FIXME: return updated profile data
  return apiSuccess({ ok: true })
}
