// src/app/license/page.tsx
import LicenseCon from './licenseCon'
import Link from 'next/link'
import './page.css'

export const metadata = {
  title: 'ใบอนุญาต | SG-WORKING',
}

export default function LicensePage() {
  return (
    <main className="license-container">
      <header className="license-header">
        <h1>📄 ข้อมูลใบอนุญาตเจาะน้ำบาดาล</h1>
        <Link href="/license/add" className="addLicense">
          ➕ เพิ่มใบอนุญาต
        </Link>
      </header>
      <LicenseCon />
    </main>
  )
}
