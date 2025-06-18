import Link from 'next/link'
import './Nav.css'

export default function Nav() {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-links">
          <Link href="/" className="nav-link">
            หน้าแรก
          </Link>
          <Link href="/project-manage" className="nav-link">
            โปรเจค
          </Link>
          <Link href="/HR" className="nav-link">
            ฝ่ายบุคคล
          </Link>
          <Link href="/accounting" className="nav-link">
            ฝ่ายการเงิน
          </Link>
        </div>
      </div>
    </nav>
  )
}
