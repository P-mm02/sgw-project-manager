import './page.css'
import Link from 'next/link'

export const metadata = {
  title: 'หน้าแรก | SG-WORKING',
}

export default function HomePage() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>🏠 หน้าแรก | SG-WORKING</h1>
        <p>แดชบอร์ดรวมภาพรวมระบบล่าสุด</p>
      </header>

      <div className="dashboard-grid">
        {/* Urgent Announcements */}
        <Link href="/OperationalPlan" className="card operationalPlanLink">
          <h1 className="text-center">
            แผนการปฎิบัติงาน
            <br />
            Operational plan
          </h1>
        </Link>

        <section className="card highlight-card">
          <h2>📢 ประกาศด่วน</h2>
          <ul>
            <li>⏰ เรื่องที่ 1: 20 มิ.ย. เวลา 22:00</li>
            <li>📩 เรื่องที่ 2: ภายใน 25 มิ.ย.</li>
          </ul>
        </section>
        <Link
          href="/ManageNotification"
          className="card manageNotificationLink"
        >
          <h1 className="text-center">
            ควบคุมการแจ้งเตือน
            <br />
            Manage Notification
          </h1>
        </Link>
        {/* Upcoming Holidays */}
        <section className="card">
          <h2>🗓️ วันหยุดราชการ</h2>
          <ul>
            <li>20 ก.ค. 2025 - วันอาสาฬหบูชา</li>
            <li>21 ก.ค. 2025 - วันเข้าพรรษา</li>
          </ul>
        </section>

        {/* Project Status */}
        <section className="card">
          <h2>📊 โครงการล่าสุด</h2>
          <ul className="status-list">
            <li>
              <span className="badge active">●</span> โครงการ A - กำลังดำเนินการ
            </li>
            <li>
              <span className="badge paused">●</span> โครงการ B - หยุดชั่วคราว
            </li>
            <li>
              <span className="badge pending">●</span> โครงการ C - รอเริ่มงาน
            </li>
          </ul>
        </section>

        {/* Tasks */}
        <section className="card">
          <h2>✅ งานที่ต้องทำวันนี้</h2>
          <ol>
            <li>ส่งแบบแปลนให้หัวหน้าโครงการ</li>
            <li>ตรวจสอบไซต์งาน จ.ลพบุรี</li>
          </ol>
        </section>

        {/* Latest Logs */}
        <section className="card">
          <h2>🕒 บันทึกงานล่าสุด</h2>
          <div className="timeline">
            <div className="log-item">
              <span className="log-time">09:14</span>
              <p>คุณ Wee: บันทึกงานใน ‘ฟาร์มโคนม’</p>
            </div>
            <div className="log-item">
              <span className="log-time">16:45</span>
              <p>คุณ Ton: บันทึกงานใน ‘โรงเรียนบางบัวทอง’</p>
            </div>
          </div>
        </section>

        {/* Latest Documents */}
        <section className="card">
          <h2>📁 เอกสารล่าสุด</h2>
          <ul>
            <li>
              <a href="#">📄 รายงานเดือนมิ.ย.2025</a>
            </li>
            <li>
              <a href="#">📷 ภาพไซต์งานจ.ราชบุรี</a>
            </li>
          </ul>
        </section>

        {/* Project Map */}
        <section className="card map-card">
          <h2>📍 แผนที่โครงการ</h2>
          <div className="map-placeholder">[🗺️ กำลังโหลดแผนที่...]</div>
        </section>
      </div>
    </main>
  )
}
