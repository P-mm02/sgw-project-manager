'use client'

import { useEffect, useState } from 'react'

export default function Cooldown() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10000) // 10s
    return () => clearTimeout(timer)
  }, [])

  if (!show) return <p>⏳ Cooldown... please wait 10 seconds</p>

  return <p>✅ Cooldown complete. Component is now visible!</p>
}
