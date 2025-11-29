import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Landing Page',
    template: '%s | Landing Page',
  },
  description: 'Website giới thiệu sản phẩm',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: 'Landing Page',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}

