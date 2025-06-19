import './page.css'

export const metadata = {
  title: 'หน้าแรก | SG-WORKING',
}

export default function HomePage() {
  return (
    <main className="homepage-container">
      <h1>🏠 หน้าแรก | SG-WORKING</h1>

      {/* 📢 Urgent Announcements */}
      <section className="section">
        <h2>📢 ประกาศด่วน</h2>
        <ul>
          <li>⏰ ระบบจะปิดปรับปรุงในวันที่ 20 มิ.ย. เวลา 22:00</li>
          <li>📩 ส่งรายงานโครงการภายใน 25 มิ.ย.</li>
        </ul>
      </section>

      {/* 🗓️ Holidays */}
      <section className="section">
        <h2>🗓️ วันหยุด</h2>
        <ul>
          <li>วันอาสาฬหบูชา - 20 ก.ค. 2025</li>
          <li>วันเข้าพรรษา - 21 ก.ค. 2025</li>
        </ul>
      </section>

      {/* 📊 Recent Projects */}
      <section className="section">
        <h2>📊 โครงการล่าสุด</h2>
        <ul>
          <li>โครงการ A - 🟢 กำลังดำเนินการ</li>
          <li>โครงการ B - 🔴 หยุดชั่วคราว</li>
          <li>โครงการ C - 🟡 รอเริ่มงาน</li>
        </ul>
      </section>

      {/* ✅ Today’s Tasks */}
      <section className="section">
        <h2>✅ งานที่ต้องทำวันนี้</h2>
        <ul>
          <li>ส่งแบบแปลนให้หัวหน้าโครงการ</li>
          <li>ตรวจสอบความคืบหน้าไซต์งาน จ.ลพบุรี</li>
        </ul>
      </section>

      {/* 🕒 Latest Work Logs */}
      <section className="section">
        <h2>🕒 บันทึกงานล่าสุด</h2>
        <ul>
          <li>📌 คุณ Wee บันทึกงานใน ‘ฟาร์มโคนมดารา’ เวลา 09:14</li>
          <li>📌 คุณ Ton บันทึกงานใน ‘โรงเรียนบางบัวทอง’ เวลา 16:45</li>
        </ul>
      </section>

      {/* 📁 Latest Documents */}
      <section className="section">
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

      {/* 📍 Map (optional placeholder) */}
      <section className="section">
        <h2>📍 แผนที่โครงการ</h2>
        <p>[📌 แผนที่แสดงโครงการทั้งหมด]</p>
        {/* You can embed Leaflet map here later */}
      </section>
    </main>
  )
}
