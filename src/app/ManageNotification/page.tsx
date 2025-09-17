import PageClient from './pageClient'
import './page.css'
import BackButton from '@/components/BackButton'

export const metadata = {
  title: 'จัดการแจ้งเตือน | SG-WORKING',
}

// Dynamically load the client component without SSR

export default function ManageNotificationPage() {
  return (
    <main className="notification-page">
      <BackButton />
      <h1>🛎️ จัดการแจ้งเตือน</h1>
      <PageClient />
    </main>
  )
}
