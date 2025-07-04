'use client'

import dynamic from 'next/dynamic'
import './EmployeeList/EmployeeList.css'

const EmployeeList = dynamic(() => import('./EmployeeList/EmployeeList'), {
  ssr: false,
  loading: () => <p>Loading employee list...</p>,
})

export default function HRPageClient() {
  return (
    <main className="hr-container">
      <h1 className="hr-title">👥 ฝ่ายบุคคล (HR)</h1>
      <p className="hr-description">
        จัดการข้อมูลพนักงาน ลางาน เอกสารสำคัญ และตรวจสอบเวลาเข้า-ออกงาน
      </p>

      <section className="hr-section">
        <EmployeeList />
      </section>

      <section className="hr-section">
        <h2>🗓️ การลางาน</h2>
        <p>ระบบขอลางานจะสามารถใช้งานได้ในเร็ว ๆ นี้</p>
      </section>

      <section className="hr-section">
        <h2>📁 เอกสารพนักงาน</h2>
        <ul className="hr-documents">
          <li>
            <a href="#">📄 แบบฟอร์มลางาน.pdf</a>
          </li>
          <li>
            <a href="#">📘 คู่มือพนักงาน.pdf</a>
          </li>
        </ul>
      </section>

      <section className="hr-section">
        <h2>⏱️ เวลาเข้า-ออกงาน</h2>
        <p>ระบบกำลังเชื่อมต่อกับระบบบันทึกเวลา...</p>
      </section>
    </main>
  )
}
