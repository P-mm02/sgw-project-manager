import './page.css'
import { connectToDB } from '@/lib/mongoose'
import License, { LicenseType } from '@/models/License'
import { formatDateToThai } from '@/lib/formatDateToThai'
import Link from 'next/link'
import { sendLineMessage } from '@/lib/sendLineMessage'


export const metadata = {
  title: 'ใบอนุญาต | SG-WORKING',
}

export default async function LicensingWork() {
  await connectToDB()
  const licenses = (await License.find()
    .sort({ licenseExpireDate: -1 })
    .lean()) as LicenseType[]  
  const today = new Date()
  const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
  const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const userId = 'Ua053de08814ccd75375a472e6a404f3e'

  await Promise.all(
    licenses.map(async (license) => {
      const rawExpireDate = license.licenseExpireDate
      if (!rawExpireDate) return // skip if undefined or null

      const expireDate = new Date(rawExpireDate)
      if (
        (license.notificationSent === 0 && expireDate < ninetyDaysFromNow) ||
        (license.notificationSent === 1 && expireDate < sixtyDaysFromNow) ||
        (license.notificationSent === 2 && expireDate < thirtyDaysFromNow)
      ) {
        const message =
          '⚠️' +
          license.clientName +
          '\nใบอนุญาตเลขที่\n' +
          license.licenseNumber +
          '\nจะหมดอายุ วันที่\n' +
          formatDateToThai(license.licenseExpireDate) +
          '\n📌 เตรียมดำเนินการต่ออายุใบอนุญาต'
        await sendLineMessage(userId, message)
        //console.log(message)

        // Optional DB update
        await License.findByIdAndUpdate(license._id, {
          $inc: { notificationSent: 1 },
        })
        
      }
    })
  )
  
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
                ใบอนุญาต
                {{
                  drilling: 'เจาะบ่อ',
                  waterUse: 'ใช้น้ำ',
                  modify: 'แก้ไขบ่อ',
                  cancel: 'อุดกลบบ่อ',
                }[item.licenseType ?? ''] || ''}
              </h2>
              <h2>เลขที่: {item.licenseNumber || ''}</h2>
              <ul>
                <li>
                  <strong>ประเภท:</strong>{' '}
                  {{
                    drilling: 'เจาะบ่อ',
                    waterUse: 'ใช้น้ำ',
                    modify: 'แก้ไขบ่อ',
                    cancel: 'อุดกลบบ่อ',
                  }[item.licenseType ?? ''] || 'ไม่ระบุ'}
                </li>
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
                  <strong>เลขบ่อ:</strong> {item.wellNumber || '—'}
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
