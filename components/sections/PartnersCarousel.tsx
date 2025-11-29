'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Partner {
  id: string
  name: string
  logo: string
  url: string | null
}

export function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => setPartners(data))
      .catch(() => {})
  }, [])

  if (partners.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Đối tác</h2>
          <p className="text-gray-600 text-lg">
            Những đối tác tin cậy của chúng tôi
          </p>
        </div>
        <div className="flex gap-8 overflow-x-auto justify-center items-center">
          {partners.map((partner) => {
            const content = (
              <div key={partner.id} className="flex-shrink-0 w-32 h-32 relative grayscale hover:grayscale-0 transition-all">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            )
            
            return partner.url ? (
              <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              content
            )
          })}
        </div>
      </div>
    </section>
  )
}

