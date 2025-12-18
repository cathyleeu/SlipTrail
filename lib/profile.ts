import { supabaseServer } from '@lib/supabase/server'
import type { ProfileRow, UpdateProfileInput } from '@types'

export async function getMyProfile() {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { profile: null as ProfileRow | null, error: 'Unauthorized' as string | null }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, created_at, updated_at')
    .eq('id', user.id)
    .single()

  if (error) return { profile: null as ProfileRow | null, error: error.message as string }
  return { profile: data as ProfileRow, error: null as string | null }
}

export async function updateMyProfile(input: UpdateProfileInput) {
  const supabase = await supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { profile: null as ProfileRow | null, error: 'Unauthorized' as string | null }

  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', user.id)
    .select('id, name, created_at, updated_at')
    .single()

  if (error) return { profile: null as ProfileRow | null, error: error.message as string }
  return { profile: data as ProfileRow, error: null as string | null }
}
