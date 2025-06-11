import ProjectCon from '../components/ProjectCon/ProjectCon'

export const metadata = {
  title: 'งานซ่อมบำรุง | SG-WORKING',
}

export default function MaintenancePage() {
  return (
    <main>
      <ProjectCon workType="maintenance" />
      <h1>งานซ่อมบำรุง</h1>
      <p>บริการซ่อมบำรุงบ่อน้ำบาดาล</p>
    </main>
  )
}
