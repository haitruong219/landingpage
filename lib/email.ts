import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string
  subject: string
  text?: string
  html?: string
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

export async function sendContactNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || ''
  
  const html = `
    <h2>Thông tin liên hệ mới</h2>
    <p><strong>Họ tên:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Số điện thoại:</strong> ${phone}</p>` : ''}
    <p><strong>Nội dung:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `

  return sendEmail({
    to: adminEmail,
    subject: `Liên hệ mới từ ${name}`,
    html,
    text: `Họ tên: ${name}\nEmail: ${email}\n${phone ? `Số điện thoại: ${phone}\n` : ''}Nội dung: ${message}`,
  })
}

