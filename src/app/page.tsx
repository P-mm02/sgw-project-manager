import Image from "next/image";
import "@/styles/page.css";

export const metadata = {
  title: 'หน้าแรก | SG-WORKING',
}

export default function HomePage() {
  return (
    <main>
      <h1>ยินดีต้อนรับสู่ SG-WORKING</h1>
      <p>ผู้เชี่ยวชาญด้านงานเจาะน้ำบาดาลระดับมืออาชีพ</p>
    </main>
  )
}
