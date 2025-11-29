import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Logo
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Tin tức
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Liên hệ
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

