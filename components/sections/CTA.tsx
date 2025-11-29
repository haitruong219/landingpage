import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTA() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Sẵn sàng bắt đầu?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí
        </p>
        <Button href="/contact" asChild size="lg" variant="secondary">
          Liên hệ ngay
        </Button>
      </div>
    </section>
  )
}

