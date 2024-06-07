import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createSwaggerDocument } from "../swagger/swagger.config";
import * as express from "express";
import { ValidationPipe } from "@nestjs/common";
import * as cors from "cors";
// Permitir submissões de todas as origens

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(
		cors({
			origin: "http://localhost:3366",
			methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
			preflightContinue: false,
			optionsSuccessStatus: 204,
			credentials: true,
		}),
	);

	app.useGlobalPipes(new ValidationPipe());

	app.use((req, res, next) => {
		res.header(
			"Access-Control-Expose-Headers",
			"X-Access-Token, X-Refresh-Token",
		);
		next();
	});

	app.use(
		"/files/profile-images",
		express.static("public/files/profile-images"),
	);
	app.use("/files/submissions", express.static("public/files/submissions"));
	createSwaggerDocument(app);

	console.log(`Server started at localhost:${process.env.BACKEND_PORT}`);
	await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
