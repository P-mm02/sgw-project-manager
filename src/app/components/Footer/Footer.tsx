'use client'

import './Footer.css'
import Link from 'next/link'
import { Mail, Globe, Phone, Facebook, MessageSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="sgw-footer">
      <div className="sgw-footer-container">
        <div className="sgw-footer-col">
          <Link href="/" className="sgw-footer-logo">
            SG-WORKING
          </Link>
          <p className="sgw-footer-desc">
            บริษัทก่อตั้งปี พ.ศ. 2536 ให้บริการน้ำบาดาลทั่วไทย
          </p>
          <p className="sgw-footer-contact-item">
            <Phone size={16} /> 0-2735-07898
          </p>
          <p className="sgw-footer-contact-item">
            📍 75 ซอยรามคำแหง 60 (สวนสน) แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240
          </p>
        </div>

        <div className="sgw-footer-col">
          <h3 className="sgw-footer-heading">ติดต่อเรา</h3>
          <ul className="sgw-footer-links">
            <li>
              <a
                href="https://line.me/ti/p/your-line-id"
                target="_blank"
                rel="noopener noreferrer"
                className="sgw-footer-link"
              >
                <MessageSquare size={16} /> Line
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/your-page"
                target="_blank"
                rel="noopener noreferrer"
                className="sgw-footer-link"
              >
                <Facebook size={16} /> Facebook
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@siamgroundwater.com"
                className="sgw-footer-link"
              >
                <Mail size={16} /> Email
              </a>
            </li>
            <li>
              <a
                href="https://siamgroundwater.com"
                target="_blank"
                rel="noopener noreferrer"
                className="sgw-footer-link"
              >
                <Globe size={16} /> Website
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sgw-footer-bottom">
        <p>
          © {new Date().getFullYear()} SiamGroundwater Co.,Ltd. สงวนลิขสิทธิ์
        </p>
      </div>
    </footer>
  )
}
