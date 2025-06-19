import ProjectCon from './ProjectCon/ProjectCon'

export const metadata = {
  title: 'จัดการโปรเจค | SG-WORKING',
}

//export const dynamic = 'force-dynamic' // optional: always fresh fetch

export default async function ProjectsPage() {
/*   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8888'

  const res = await fetch(`${baseUrl}/api/edge-projects`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }

  const { data } = await res.json() */
  return (
    <main>
      <ProjectCon />
    </main>    
  )
}

