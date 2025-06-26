// src/app/project-manage/page.tsx
import ProjectClient from './ProjectClient'

export const metadata = {
  title: 'จัดการโปรเจค | SG-WORKING',
}

export default function ProjectsPage() {
  return (
    <main>
      <ProjectClient />
    </main>
  )
}
