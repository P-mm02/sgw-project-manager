'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import './Nav.css'

export default function Nav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            หน้าแรก
          </Link>
          <Link
            href="/project-manage"
            className={`nav-link ${
              pathname === '/project-manage' ? 'active' : ''
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            โปรเจค
          </Link>
          <Link
            href="/license"
            className={`nav-link ${pathname === '/license' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ใบอนุญาต
          </Link>
          <Link
            href="/Marketing"
            className={`nav-link ${pathname === '/Marketing' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            การตลาด
          </Link>
          <Link
            href="/HR"
            className={`nav-link ${pathname === '/HR' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ฝ่ายบุคคล
          </Link>
          <Link
            href="/accountant"
            className={`nav-link ${pathname === '/accountant' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ฝ่ายการเงิน
          </Link>
        </div>
      </div>
    </nav>
  )
}
