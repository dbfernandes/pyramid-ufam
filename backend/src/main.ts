import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createSwaggerDocument } from "../swagger/swagger.config";
import * as express from "express";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.use("/files/submissions", express.static("public/files/submissions"));
	createSwaggerDocument(app);

	console.log(`Server started at localhost:${process.env.PORT}`);
	await app.listen(process.env.PORT);
}
bootstrap();
