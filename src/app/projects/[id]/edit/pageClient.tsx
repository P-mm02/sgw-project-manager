'use client'

import dynamic from 'next/dynamic'

const EditProjectForm = dynamic(
  () => import('./EditProjectForm/EditProjectForm'),
  {
    ssr: false,
    loading: () => <p>Loading form...</p>,
  }
)

export default function PageClient() {
  return (
    <main className="edit-project-page">
      <h1 className="edit-project-title">✏️ แก้ไขโปรเจค</h1>
      <EditProjectForm />
    </main>
  )
}
