import ProjectCon from '../components/ProjectCon/ProjectCon'

export const metadata = {
  title: 'งานสำรวจ | SG-WORKING',
}

export default function SurveyPage() {
  return (
    <main>
      <ProjectCon workType="survey" />
      <h1>งานสำรวจ</h1>
      <p>บริการสำรวจพื้นที่ก่อนเจาะน้ำบาดาล และงานสำรวจธรณีวิทยาอื่นๆ</p>
    </main>
  )
}
