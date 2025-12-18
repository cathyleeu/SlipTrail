'use client'

import { useProfile } from '@hooks'
import type { ProfileRow } from '@types'
import { useEffect } from 'react'

export default function ProfileClient({ initialProfile }: { initialProfile: ProfileRow | null }) {
  const { profile, loading, error, updateProfile, user } = useProfile()

  // hydrate local state once if desired
  useEffect(() => {
    // If you want to keep the hook stateless, you can skip this and
    // render from initialProfile directly.
  }, [initialProfile])

  if (!user) return <div>Please login</div>
  if (loading && !profile) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const displayName = profile?.name ?? initialProfile?.name ?? ''

  return (
    <div>
      <div>Display name: {displayName || '(none)'}</div>
      <button onClick={() => updateProfile({ name: 'Cathy' })}>Set name</button>
    </div>
  )
}
