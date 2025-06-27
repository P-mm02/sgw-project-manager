import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/project-utils'
import EditProjectForm from '@/app/projects/[id]/edit/EditProjectForm/EditProjectForm' // You’ll build this next
import { Suspense } from 'react'
import './EditProjectPage.css'


type EditProjectPageProps = {
  params: {
    id: string
  }
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const projectID = await params
  const project = await getProjectById(projectID.id)

  if (!project) notFound()

    return (
      <main className="edit-project-page">
        <h1 className="edit-project-title">✏️ แก้ไขโปรเจค</h1>

        <Suspense fallback={<p>Loading...</p>}>
          <EditProjectForm initialData={project} />
        </Suspense>
      </main>
    )
    
}
