'use client'

import { Input } from '@components/Input'
import { useAuth } from '@hooks'
import { useInput } from '@hooks/useInput'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const email = useInput('')
  const password = useInput('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { success, error } = await login(email.value, password.value)
    setLoading(false)

    if (success) router.push('/')
    else setError(error as string)
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <Input {...email} type="email" placeholder="Email" className="w-full border p-2" required />

      <Input
        {...password}
        type="password"
        placeholder="Password"
        className="w-full border p-2"
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button disabled={loading} className="w-full bg-black text-white p-2">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
