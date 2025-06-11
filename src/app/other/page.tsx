import ProjectCon from '../components/ProjectCon/ProjectCon'

export const metadata = {
  title: 'งานอื่นๆ | SG-WORKING',
}

export default function OtherPage() {
  return (
    <main>
      <ProjectCon workType="others" />
      <h1>งานอื่นๆ</h1>
      <p>รวมงานบริการอื่นๆ ที่เกี่ยวข้องกับน้ำบาดาลและธรณีวิทยา</p>
    </main>
  )
}
