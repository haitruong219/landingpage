import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Chính sách',
  description: 'Chính sách bảo mật và điều khoản sử dụng',
}

export default function PolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Chính sách bảo mật</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <p>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Mọi thông tin bạn cung cấp sẽ được bảo mật và chỉ sử dụng cho mục đích liên hệ.
              </p>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Điều khoản sử dụng</CardTitle>
            </CardHeader>
            <CardContent className="prose">
              <p>
                Bằng việc sử dụng website này, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

