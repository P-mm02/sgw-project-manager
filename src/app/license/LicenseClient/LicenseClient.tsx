'use client'

import dynamic from 'next/dynamic'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'


// Dynamically load LicenseCon with SSR disabled
const LicenseCon = dynamic(() => import('./LicenseCon/LicenseCon'), {
  ssr: false,
  loading: () => <DotsLoader />,
})

export default function LicenseClientLoader() {
  return <LicenseCon />
}
