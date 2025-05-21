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
          <Link href="/drilling" className="nav-link">
            งานเจาะ
          </Link>
          <Link href="/survey" className="nav-link">
            งานสำรวจ
          </Link>
          <Link href="/dewatering" className="nav-link">
            งานสูบลดระดับน้ำ
          </Link>
          <Link href="/other" className="nav-link">
            งานอื่นๆ
          </Link>
        </div>
      </div>
    </nav>
  )
}
