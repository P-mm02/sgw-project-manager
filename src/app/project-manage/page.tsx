import ProjectCon from './ProjectCon/ProjectCon'

export const metadata = {
  title: 'จัดการโปรเจค | SG-WORKING',
}

//export const dynamic = 'force-dynamic' // optional: always fresh fetch

export default async function ProjectsPage() {
  return (
    <main>
      <ProjectCon />
    </main>    
  )
}

