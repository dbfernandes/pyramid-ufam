import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createSwaggerDocument } from "../swagger/swagger.config";
import { ValidationPipe, Logger } from "@nestjs/common";
import * as express from "express";

// Configurações centralizadas
const ALLOWED_ORIGINS = [
	"https://pyramid.icomp.ufam.edu.br",
	"https://aacc.icomp.ufam.edu.br",
	"http://localhost:3366",
	"https://equipe02wa.icomp.ufam.edu.br",
];

const CONFIG = {
	port: process.env.BACKEND_PORT || 3000,
	staticPaths: {
		profileImages: "public/files/profile-images",
		submissions: "public/files/submissions",
	},
} as const;

async function bootstrap(): Promise<void> {
	const logger = new Logger("Bootstrap");

	try {
		const app = await NestFactory.create(AppModule);

		// Configuração do CORS usando método nativo do NestJS
		app.enableCors({
			origin: (origin, callback) => {
				// Permite requisições sem origin (ex: Postman, apps mobile)
				if (!origin || ALLOWED_ORIGINS.includes(origin)) {
					callback(null, true);
				} else {
					callback(new Error(`Origin ${origin} not allowed by CORS policy`));
				}
			},
			methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
			preflightContinue: false,
			optionsSuccessStatus: 204,
			credentials: true,
			exposedHeaders: ["X-Access-Token", "X-Refresh-Token"],
		});

		// Configuração de validação global
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
			}),
		);

		// Headers customizados (removido pois já está no CORS)
		// setupCustomHeaders(app);

		// Servir arquivos estáticos
		setupStaticFiles(app);

		// Configuração do Swagger
		createSwaggerDocument(app);

		// Iniciar servidor
		await app.listen(CONFIG.port);

		logger.log(`🚀 Server running on http://localhost:${CONFIG.port}`);
		logger.log(
			`📚 Swagger docs available at http://localhost:${CONFIG.port}/api-docs`,
		);
	} catch (error) {
		logger.error("❌ Failed to start server:", error);
		process.exit(1);
	}
}

function setupStaticFiles(app: any): void {
	app.use(
		"/files/profile-images",
		express.static(CONFIG.staticPaths.profileImages),
	);

	app.use("/files/submissions", express.static(CONFIG.staticPaths.submissions));
}

// Tratamento de sinais para shutdown graceful
process.on("SIGTERM", () => {
	Logger.log("SIGTERM received, shutting down gracefully");
	process.exit(0);
});

process.on("SIGINT", () => {
	Logger.log("SIGINT received, shutting down gracefully");
	process.exit(0);
});

bootstrap();
