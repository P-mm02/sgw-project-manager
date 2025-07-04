'use client'

import dynamic from 'next/dynamic'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'

const EditProjectForm = dynamic(
  () => import('./EditProjectForm/EditProjectForm'),
  {
    ssr: false,
    loading: () => <DotsLoader/>,
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
