import * as nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";

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

export function getFirstName(name: string) {
	return name.split(" ")[0];
}

export function getFirstAndLastName(name: string) {
	const _name = name.split(" ");
	return `${_name[0]} ${_name.pop()}`;
}

export function decodeToken(token: string) {
	try {
		const decoded = jwt.verify(
			token.replace("Bearer ", ""),
			process.env.JWT_SECRET,
		);
		return decoded;
	} catch (error) {
		console.error("Failed to decode token:", error);
		throw new Error("Failed to decode token");
	}
}

export function getFilesLocation(folder: string) {
	return `${process.env.BACKEND_URL}/files/${folder}`;
}
