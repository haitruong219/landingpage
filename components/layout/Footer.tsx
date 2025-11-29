import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Về chúng tôi</h3>
            <p className="text-gray-600 text-sm">
              Website giới thiệu sản phẩm và dịch vụ chất lượng cao.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/policy" className="text-gray-600 hover:text-blue-600">
                  Chính sách
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <p className="text-gray-600 text-sm">
              Email: info@example.com<br />
              Điện thoại: 0123 456 789
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

