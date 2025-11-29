import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  })

  console.log('Created admin user:', admin.email)

  const category = await prisma.category.upsert({
    where: { slug: 'tin-tuc' },
    update: {},
    create: {
      name: 'Tin tức',
      slug: 'tin-tuc',
      description: 'Danh mục tin tức chung',
    },
  })

  console.log('Created category:', category.name)

  const post = await prisma.post.upsert({
    where: { slug: 'bai-viet-dau-tien' },
    update: {},
    create: {
      title: 'Bài viết đầu tiên',
      slug: 'bai-viet-dau-tien',
      content: '<p>Đây là nội dung bài viết đầu tiên. Bạn có thể chỉnh sửa hoặc xóa bài viết này trong admin panel.</p>',
      excerpt: 'Đây là bài viết mẫu đầu tiên',
      published: true,
      categoryId: category.id,
    },
  })

  console.log('Created post:', post.title)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

