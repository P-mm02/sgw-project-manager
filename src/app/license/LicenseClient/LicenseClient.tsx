'use client'

import { useEffect, useState } from 'react'
import { LicenseType } from '@/types/LicenseType'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'
import LicenseCon from './LicenseCon/LicenseCon'

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
  return <LicenseCon licenses={licenses} />
}
