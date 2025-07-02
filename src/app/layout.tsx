// src/app/layout.tsx
import '@/styles/globals.css'
import Nav from './components/Nav/Nav'
import Footer from './components/Footer/Footer'

export const metadata = {
  title: 'SGW-Working',
  description: 'SGW ERP website build by Wee',
  viewport: 'width=device-width, initial-scale=1', // ✅ Add this line
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
