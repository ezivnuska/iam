// apps/backend/src/utils/email.ts

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT || '587'),
	secure: false,
	auth: {
		user: process.env.SMTP_USER!,
		pass: process.env.SMTP_PASS!,
	},
})

export const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		await transporter.sendMail({
		from: `'Your App Name' <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
		to,
		subject,
		html,
		})
	} catch (error) {
		console.error('Error sending email:', error)
		throw new Error('Email could not be sent')
	}
}

// example usage in route/controller
// import { sendEmail } from '../utils/email'

// await sendEmail(
//   user.email,
//   'Reset your password',
//   `<p>Click <a href='${process.env.FRONTEND_URL}/reset-password?token=${resetToken}'>here</a> to reset your password.</p>`
// )
