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
            โครงการ
          </Link>          
        </div>
      </div>
    </nav>
  )
}
