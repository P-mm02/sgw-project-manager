'use client'

import { useEffect, useState } from 'react'
import { LicenseType } from '@/models/License'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'
import LicenseClient from './licenseCon/LicenseClient'

export default function LicenseClientLoader() {
  const [licenses, setLicenses] = useState<LicenseType[] | null>(null)

  useEffect(() => {
    const fetchLicenses = async () => {
      const res = await fetch('/api/license/')
      const data = await res.json()
      setLicenses(data)
    }

    fetchLicenses()
  }, [])

  if (!licenses) return <DotsLoader />
  return <LicenseClient licenses={licenses} />
}
