'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './Nav.css'

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            หน้าแรก
          </Link>
          <Link
            href="/project-manage"
            className={`nav-link ${
              pathname === '/project-manage' ? 'active' : ''
            }`}
          >
            โปรเจค
          </Link>
          <Link
            href="/HR"
            className={`nav-link ${pathname === '/HR' ? 'active' : ''}`}
          >
            ฝ่ายบุคคล
          </Link>
          <Link
            href="/accounting"
            className={`nav-link ${pathname === '/accounting' ? 'active' : ''}`}
          >
            ฝ่ายการเงิน
          </Link>
        </div>
      </div>
    </nav>
  )
}
