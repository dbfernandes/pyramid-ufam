import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import * as cors from "cors";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Configuração do CORS
	app.use(
		cors({
			origin: "http://localhost:3366",
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			preflightContinue: false,
			optionsSuccessStatus: 204,
			credentials: true,
		}),
	);

	// Configuração para validar as requisições
	app.useGlobalPipes(new ValidationPipe());

	// Middleware para expor os cabeçalhos de acesso
	app.use((req, res, next) => {
		res.header(
			"Access-Control-Expose-Headers",
			"X-Access-Token, X-Refresh-Token",
		);
		next();
	});

	// Rotas de arquivos estáticos
	app.use(
		"/files/profile-images",
		express.static("public/files/profile-images"),
	);
	app.use("/files/submissions", express.static("public/files/submissions"));

	// Inicia o servidor
	await app.listen(process.env.BACKEND_PORT || 3333);
	console.log(
		`Server started at localhost:${process.env.BACKEND_PORT || 3332}`,
	);
}

bootstrap();
