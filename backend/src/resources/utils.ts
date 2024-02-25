import * as nodemailer from "nodemailer";

export async function sendEmail(email: string, subject: string, text: string) {
	return await nodemailer
		.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		})
		.sendMail({
			from: process.env.SMTP_FROM,
			to: email,
			subject: subject,
			text: text,
		});
}
