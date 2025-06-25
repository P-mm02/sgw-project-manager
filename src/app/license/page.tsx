import './page.css'
import { connectToDB } from '@/lib/mongoose'
import License, { LicenseType } from '@/models/License'
import { formatDateToThai } from '@/lib/formatDateOutput'
import Link from 'next/link'

export const metadata = {
  title: 'ใบอนุญาต | SG-WORKING',
}

export default async function LicensingWork() {
  await connectToDB()
  const licenses = (await License.find()
    .sort({ licenseExpireDate: -1 })
    .lean()) as LicenseType[]

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
        {licenses.map((item) => {
          const expireDate = item.licenseExpireDate
            ? new Date(item.licenseExpireDate)
            : undefined
          const issueDate = item.licenseIssuedDate
            ? new Date(item.licenseIssuedDate)
            : undefined

          const isExpired = expireDate ? expireDate < today : false
          const diffInDays = expireDate
            ? Math.ceil(
                (expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
              )
            : 0
          const isNearExpired = diffInDays > 0 && diffInDays <= 30

          return (
            <div
              key={item._id}
              className={`license-card ${
                isExpired
                  ? 'expired'
                  : isNearExpired
                  ? 'near-expired'
                  : 'active'
              }`}
            >
              <h2>
                บ่อเลขที่ {item.licenseNumber || item.wellNumber || 'ไม่ระบุ'}
              </h2>
              <ul>
                <li>
                  <strong>โครงการ:</strong> {item.clientName || 'ไม่ระบุ'}
                </li>
                <li>
                  <strong>ที่ตั้ง:</strong> {item.clientAddress || 'ไม่ระบุ'}
                </li>
                <li>
                  <strong>รายละเอียดบ่อ:</strong> {item.wellDescription || '—'}
                </li>
                <li>
                  <strong>วันที่เริ่มใช้:</strong>{' '}
                  {issueDate ? formatDateToThai(issueDate) : 'ไม่ระบุ'}
                </li>
                <li>
                  <strong>วันหมดอายุ:</strong>{' '}
                  {expireDate ? formatDateToThai(expireDate) : 'ไม่ระบุ'}
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
                  {expireDate
                    ? isExpired
                      ? 'หมดอายุแล้ว'
                      : `${diffInDays} วัน`
                    : 'ไม่ระบุ'}
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
