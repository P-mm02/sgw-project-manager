import './page.css'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { formatDateToThai } from '@/lib/formatDateOutput'
import Link from 'next/link'
import { getDateDiff } from '@/lib/dateDiff'


export const metadata = {
  title: 'ใบอนุญาต | SG-WORKING',
}

export default async function LicensingWork() {
  await connectToDB()
  const licenses = await License.find().sort({ licenseExpireDate: -1 }).lean()

  const today = new Date()

  return (
    <main className="license-container">
      <header className="license-header">
        <h1>📄 ข้อมูลใบอนุญาตเจาะน้ำบาดาล</h1>
        <Link href="/license/add" className="addLicense">
          ➕ เพิ่มใบอนุญาต
        </Link>
      </header>

      <div className="license-grid">
        {licenses.map((item: any) => {
          const isExpired = new Date(item.licenseExpireDate) < today

          const diffInDays =
            (new Date(item.licenseExpireDate).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)

          const isNearExpired = diffInDays > 0 && diffInDays <= 30
          

          return (
            <div
              key={item._id}
              className={`license-card ${
                isExpired ? 'expired' : isNearExpired ? 'near-expired' : ''
              }`}
            >
              <h2>บ่อเลขที่ {item.licenseNumber || item.wellNumber}</h2>
              <ul>
                <li>
                  <strong>โครงการ:</strong> {item.clientName}
                </li>
                <li>
                  <strong>ที่ตั้ง:</strong> {item.clientAddress}
                </li>
                <li>
                  <strong>รายละเอียดบ่อ:</strong> {item.wellDescription}
                </li>
                <li>
                  <strong>วันที่เริ่มใช้:</strong>{' '}
                  {formatDateToThai(item.licenseIssuedDate)}
                </li>
                <li>
                  <strong>วันหมดอายุ:</strong>{' '}
                  {formatDateToThai(item.licenseExpireDate)}
                </li>
                <li>
                  <strong>สถานะ:</strong>{' '}
                  {isExpired
                    ? '🔴 หมดอายุแล้ว'
                    : isNearExpired
                    ? '🟡 ใกล้หมดอายุ'
                    : '🟢 ใช้งานอยู่'}
                </li>
                <li>
                  <strong>เหลือเวลา:</strong>{' '}
                  {getDateDiff(item.licenseExpireDate)} วัน
                </li>
              </ul>
              <div className="license-actions">
                <a href="#">📎 ดูเอกสารแนบ</a>
                <a href="#">📍 เปิดในแผนที่</a>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
