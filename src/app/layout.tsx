// app/layout.tsx

import '@/styles/globals.css'
import Nav from './components/Nav/Nav'
import Footer from './components/Footer/Footer'

export const metadata = {
  title: 'SGW-Working',
  description: 'SGW ERP website build by Wee',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
