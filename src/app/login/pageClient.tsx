'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PageClient() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push(redirect)
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <section className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h1>Admin Login</h1>
        <input
          value={username}
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          autoComplete="username"
        />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
        {error && <div className="admin-login-error">{error}</div>}
      </form>
    </section>
  )
}
