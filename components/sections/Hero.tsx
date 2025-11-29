import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            Giải pháp tốt nhất cho doanh nghiệp của bạn
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Chúng tôi cung cấp các sản phẩm và dịch vụ chất lượng cao, đáp ứng mọi nhu cầu của bạn.
          </p>
          <div className="flex gap-4">
            <Button href="/contact" asChild size="lg" variant="secondary">
              Liên hệ ngay
            </Button>
            <Button href="/blog" asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

