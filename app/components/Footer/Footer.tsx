import './Footer.css'

export default function Footer() {
  return (
    <footer className="sgw-footer">
      <div className="sgw-footer-container">
        <div className="sgw-footer-about">
          <a href="/" className="sgw-footer-logo">
            SG-WORKING
          </a>
          <p>
            Specializing in groundwater solutions across Thailand since 2010.
          </p>
        </div>

        <div>
          <h3 className="sgw-footer-heading">Services</h3>
          <div className="sgw-footer-links">
            <a href="#" className="sgw-footer-link">
              Groundwater Survey
            </a>
            <a href="#" className="sgw-footer-link">
              Drilling Services
            </a>
            <a href="#" className="sgw-footer-link">
              Dewatering Systems
            </a>
          </div>
        </div>

        <div>
          <h3 className="sgw-footer-heading">Company</h3>
          <div className="sgw-footer-links">
            <a href="#" className="sgw-footer-link">
              About Us
            </a>
            <a href="#" className="sgw-footer-link">
              Projects
            </a>
            <a href="#" className="sgw-footer-link">
              Contact
            </a>
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
