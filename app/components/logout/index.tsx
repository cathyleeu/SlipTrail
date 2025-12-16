'use client'

import { useAuth } from '@hooks/useAuth'

export function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button onClick={logout} className="text-sm underline">
      Logout
    </button>
  )
}
