import './page.css'

export const metadata = {
  title: 'ใบอนุญาต | SG-WORKING',
}

export default function LicensingWork() {
  return (
    <main className="license-container">
      <header className="license-header">
        <h1>📄 ข้อมูลใบอนุญาตเจาะน้ำบาดาล</h1>
        <p>ตรวจสอบสถานะใบอนุญาต จุดเจาะ และวันหมดอายุของแต่ละโครงการ</p>
      </header>

      <div className="license-grid">
        {/* Example License Card */}
        <div className="license-card">
          <h2>บ่อเลขที่ 001/2567</h2>
          <ul>
            <li>
              <strong>โครงการ:</strong> ฟาร์มโคนม
            </li>
            <li>
              <strong>ตำแหน่ง:</strong> 14.2342, 100.1122
            </li>
            <li>
              <strong>ที่ตั้ง:</strong> ต.บางงา อ.ท่าวุ้ง จ.ลพบุรี
            </li>
            <li>
              <strong>วันที่เริ่มใช้:</strong> 1 ม.ค. 2567
            </li>
            <li>
              <strong>วันหมดอายุ:</strong> 31 ธ.ค. 2567
            </li>
            <li>
              <strong>สถานะ:</strong> 🟢 ใช้งานอยู่
            </li>
          </ul>
          <div className="license-actions">
            <a href="#">📎 ดูเอกสารแนบ</a>
            <a href="#">📍 เปิดในแผนที่</a>
          </div>
        </div>

        {/* Another Example */}
        <div className="license-card expired">
          <h2>บ่อเลขที่ 045/2566</h2>
          <ul>
            <li>
              <strong>โครงการ:</strong> โรงงาน A
            </li>
            <li>
              <strong>ตำแหน่ง:</strong> 13.4567, 99.8890
            </li>
            <li>
              <strong>ที่ตั้ง:</strong> ต.หนองปลาไหล อ.บ้านโป่ง จ.ราชบุรี
            </li>
            <li>
              <strong>วันที่เริ่มใช้:</strong> 1 มิ.ย. 2566
            </li>
            <li>
              <strong>วันหมดอายุ:</strong> 31 พ.ค. 2567
            </li>
            <li>
              <strong>สถานะ:</strong> 🔴 หมดอายุแล้ว
            </li>
          </ul>
          <div className="license-actions">
            <a href="#">📎 ดูเอกสารแนบ</a>
            <a href="#">📍 เปิดในแผนที่</a>
          </div>
        </div>
      </div>
    </main>
  )
}
