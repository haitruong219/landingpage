'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string | null
  image: string | null
  slug: string
}

export function ProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {})
  }, [])

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Sản phẩm & Dịch vụ</h2>
          <p className="text-gray-600 text-lg">
            Khám phá các sản phẩm và dịch vụ của chúng tôi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto">
          {products.map((product) => (
            <Card key={product.id} className="min-w-[300px]">
              {product.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                    loading="lazy"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {product.description || 'Mô tả sản phẩm...'}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

