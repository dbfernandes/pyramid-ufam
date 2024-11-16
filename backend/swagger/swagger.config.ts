import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
	.setTitle("Aacc API")
	.setDescription("An API written for the Aacc webapp. This project's goal is to blabla.")
	.setVersion("1.0")
	.build();

export const createSwaggerDocument = (app) => {
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api-docs", app, document);
};