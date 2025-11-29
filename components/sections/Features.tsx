import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const features = [
  {
    title: 'Tính năng 1',
    description: 'Mô tả chi tiết về tính năng nổi bật đầu tiên của sản phẩm.',
    icon: '✨',
  },
  {
    title: 'Tính năng 2',
    description: 'Mô tả chi tiết về tính năng nổi bật thứ hai của sản phẩm.',
    icon: '🚀',
  },
  {
    title: 'Tính năng 3',
    description: 'Mô tả chi tiết về tính năng nổi bật thứ ba của sản phẩm.',
    icon: '💡',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Tính năng nổi bật</h2>
          <p className="text-gray-600 text-lg">
            Những tính năng làm nên sự khác biệt của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

