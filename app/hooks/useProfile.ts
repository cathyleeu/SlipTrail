'use client'

import { useAuthContext } from '@context/AuthContext'
import { supabaseClient } from '@lib/supabase/client'
import type { ProfileRow, UpdateProfileInput } from '@types'
import { useCallback, useMemo, useState } from 'react'

type UseProfileState = {
  profile: ProfileRow | null
  loading: boolean
  error: string | null
}

export function useProfile() {
  const { user, loading: authLoading } = useAuthContext()
  const supabase = useMemo(() => supabaseClient(), [])
  const isAuthLoading = !!authLoading

  const [state, setState] = useState<UseProfileState>({
    profile: null,
    loading: true,
    error: null,
  })

  const refresh = useCallback(async () => {
    if (!user) {
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, created_at, updated_at')
      .eq('id', user.id)
      .single()

    if (error) {
      setState({ profile: null, loading: false, error: error.message })
      return
    }

    setState({ profile: data as ProfileRow, loading: false, error: null })
  }, [supabase, user])

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!user) return { success: false as const, error: 'Unauthorized' }

      const { data, error } = await supabase
        .from('profiles')
        .update(input)
        .eq('id', user.id)
        .select('id, name, created_at, updated_at')
        .single()

      if (error) return { success: false as const, error: error.message }

      setState({ profile: data as ProfileRow, loading: false, error: null })
      return { success: true as const, error: null }
    },
    [supabase, user]
  )

  const derivedLoading = isAuthLoading ? true : user ? state.loading : false
  const derivedProfile = user ? state.profile : null
  const derivedError = user ? state.error : null

  return {
    profile: derivedProfile,
    loading: derivedLoading,
    error: derivedError,
    refresh,
    updateProfile,
    user,
  }
}
