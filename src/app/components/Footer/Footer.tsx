import './Footer.css'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="sgw-footer">
      <div className="sgw-footer-container">
        <div className="sgw-footer-about">
          <Link href="/" className="sgw-footer-logo">
            SG-WORKING
          </Link>
          <p>
            Specializing in groundwater solutions across Thailand since 2010.
          </p>
        </div>

        <div>
          <h3 className="sgw-footer-heading">Services</h3>
          <div className="sgw-footer-links">
            <Link href="#" className="sgw-footer-link">
              Groundwater Survey
            </Link>
            <Link href="#" className="sgw-footer-link">
              Drilling Services
            </Link>
            <Link href="#" className="sgw-footer-link">
              Dewatering Systems
            </Link>
          </div>
        </div>

        <div>
          <h3 className="sgw-footer-heading">Company</h3>
          <div className="sgw-footer-links">
            <Link  href="#" className="sgw-footer-link">
              About Us
            </Link>
            <Link href="#" className="sgw-footer-link">
              Projects
            </Link>
            <Link href="#" className="sgw-footer-link">
              Contact
            </Link>
          </div>
        </div>

        <div className="sgw-footer-bottom">
          <p>
            © {new Date().getFullYear()} SiamGroundwater Co.,Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
