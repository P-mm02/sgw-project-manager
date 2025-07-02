// src/app/license/LicenseClient.tsx
'use client'
import { useEffect, useState } from 'react'
import './LicenseCon.css'
import './LicenseCon-mobile.css'
import { formatDateToThai } from '@/lib/date/formatDateToThai'
import DeleteLicenseButton from '../../delete/DeleteLicenseButton'
import { LicenseType } from '@/types/LicenseType' // ✅ now safe in client
import Link from 'next/link'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'


export default function LicenseCon() {
  const [licenses, setLicenses] = useState<LicenseType[] | null>(null)
  useEffect(() => {
    const fetchLicenses = async () => {
      const res = await fetch('/api/license/')
      const data = await res.json()
      setLicenses(data)
    }

    fetchLicenses()
  }, [])

  const today = new Date()

  if (!licenses) return <DotsLoader />
  return (
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
              isExpired ? 'expired' : isNearExpired ? 'near-expired' : 'active'
            }`}
          >
            <h2>
              <strong>โครงการ:</strong> {item.clientName || 'ไม่ระบุ'}
            </h2>
            <h2>
              ใบอนุญาต
              {{
                drilling: 'เจาะบ่อ',
                waterUse: 'ใช้น้ำ',
                modify: 'แก้ไขบ่อ',
                cancel: 'อุดกลบบ่อ',
              }[
                item.licenseType as
                  | 'drilling'
                  | 'waterUse'
                  | 'modify'
                  | 'cancel'
              ] || ''}
            </h2>
            <h2>เลขที่: {item.licenseNumber || ''}</h2>
            <ul>
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
            <Link href={`/license/edit/${item._id}`} className="edit-btn">
              ✏️ แก้ไข
            </Link>
            {item._id && <DeleteLicenseButton id={item._id.toString()} />}
          </div>
        )
      })}
    </div>
  )
}
