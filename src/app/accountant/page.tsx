import './page.css'

export const metadata = {
  title: 'ฝ่ายการเงิน | SG-WORKING',
}

export default function AccountantPage() {
  return (
    <main className="account-container">
      <h1 className="account-title">💰 ฝ่ายการเงิน (Accounting)</h1>
      <p className="account-description">
        ตรวจสอบรายรับรายจ่าย บันทึกค่าใช้จ่าย ดูรายงานการเงิน
        และอัปโหลดเอกสารบัญชี
      </p>

      {/* รายรับ-รายจ่ายล่าสุด */}
      <section className="account-section">
        <h2>📊 รายการล่าสุด</h2>
        <table className="account-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รายละเอียด</th>
              <th>ประเภท</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-06-18</td>
              <td>ค่าน้ำมันเครื่องจักร</td>
              <td>รายจ่าย</td>
              <td>-฿5,200</td>
            </tr>
            <tr>
              <td>2025-06-17</td>
              <td>ชำระเงินจากโครงการฟาร์มโคนม</td>
              <td>รายรับ</td>
              <td>+฿104,915</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* เอกสารบัญชี */}
      <section className="account-section">
        <h2>📁 เอกสารบัญชี</h2>
        <ul className="account-documents">
          <li>
            <a href="#">📄 ใบเสร็จ-ฟาร์มโคนม.pdf</a>
          </li>
          <li>
            <a href="#">📄 รายงานรายจ่าย มิ.ย.2025.xlsx</a>
          </li>
        </ul>
      </section>

      {/* การวิเคราะห์ (placeholder) */}
      <section className="account-section">
        <h2>📈 การวิเคราะห์เบื้องต้น</h2>
        <p>ระบบกำลังรวบรวมข้อมูลเพื่อแสดงกราฟรายรับ-รายจ่ายในเร็ว ๆ นี้</p>
      </section>
    </main>
  )
}
