import './page.css'

export const metadata = {
  title: 'ฝ่ายการตลาด | SG-WORKING',
}

export default function MarketingPage() {
  return (
    <main className="marketing-container">
      <header className="marketing-header">
        <h1>📢 ฝ่ายการตลาด (Marketing)</h1>
        <p>ดูแคมเปญล่าสุด สถิติเข้าถึงลูกค้า และสื่อประชาสัมพันธ์ต่าง ๆ</p>
      </header>

      <div className="marketing-grid">
        {/* Campaign Highlights */}
        <section className="marketing-card highlight">
          <h2>📈 แคมเปญล่าสุด</h2>
          <ul>
            <li>🔹 โปรเจกต์บ่อบาดาลภาคตะวันออกเฉียงเหนือ</li>
            <li>🔹 โฆษณาบน Facebook Ads เริ่ม 15 มิ.ย. - 15 ก.ค.</li>
            <li>🔹 จัดสัมมนา Zoom วันที่ 5 ก.ค. นี้</li>
          </ul>
        </section>

        {/* Channels */}
        <section className="marketing-card">
          <h2>📡 ช่องทางการตลาด</h2>
          <ul>
            <li>🌐 เว็บไซต์บริษัท</li>
            <li>📱 Facebook / TikTok</li>
            <li>📧 Email Marketing</li>
            <li>📦 โบรชัวร์ส่งตรง</li>
          </ul>
        </section>

        {/* Statistics */}
        <section className="marketing-card">
          <h2>📊 สถิติการเข้าถึง</h2>
          <ul>
            <li>
              ผู้เข้าชมเว็บเดือนนี้: <strong>12,400</strong>
            </li>
            <li>
              ข้อความติดต่อใหม่: <strong>58 รายการ</strong>
            </li>
            <li>
              Conversion Rate: <strong>5.2%</strong>
            </li>
          </ul>
        </section>

        {/* Resources */}
        <section className="marketing-card">
          <h2>📁 เอกสารและสื่อประชาสัมพันธ์</h2>
          <ul>
            <li>
              <a href="#">📄 Company Profile 2025.pdf</a>
            </li>
            <li>
              <a href="#">🎨 Banner_โครงการใหม่.jpg</a>
            </li>
            <li>
              <a href="#">🧾 สคริปต์โฆษณา Facebook.docx</a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
