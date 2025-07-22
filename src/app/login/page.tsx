import { Suspense } from 'react'
import './page.css'
import PageClient from './pageClient'

export default function Page() {
  return (
    <Suspense>
      <PageClient />
    </Suspense>
  )
}
