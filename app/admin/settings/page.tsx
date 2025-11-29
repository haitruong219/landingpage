import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cài đặt hệ thống</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình Email</CardTitle>
            <CardDescription>
              Cấu hình SMTP để gửi email thông báo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/settings" method="POST" className="space-y-4">
              <Input
                label="SMTP Host"
                name="smtp_host"
                defaultValue={settingsMap.SMTP_HOST || process.env.SMTP_HOST || ''}
              />
              <Input
                label="SMTP Port"
                name="smtp_port"
                type="number"
                defaultValue={settingsMap.SMTP_PORT || process.env.SMTP_PORT || '587'}
              />
              <Input
                label="SMTP User"
                name="smtp_user"
                defaultValue={settingsMap.SMTP_USER || process.env.SMTP_USER || ''}
              />
              <Input
                label="SMTP Password"
                name="smtp_pass"
                type="password"
                defaultValue={settingsMap.SMTP_PASS || ''}
                placeholder="Để trống nếu không muốn thay đổi"
              />
              <Input
                label="Admin Email"
                name="admin_email"
                defaultValue={settingsMap.ADMIN_EMAIL || process.env.ADMIN_EMAIL || ''}
              />
              <Button type="submit">Lưu cài đặt Email</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook</CardTitle>
            <CardDescription>
              URL webhook để nhận thông báo khi có liên hệ mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/settings" method="POST" className="space-y-4">
              <Input
                label="Webhook URL"
                name="webhook_url"
                type="url"
                defaultValue={settingsMap.WEBHOOK_URL || process.env.WEBHOOK_URL || ''}
                placeholder="https://example.com/webhook"
              />
              <Button type="submit">Lưu Webhook</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

