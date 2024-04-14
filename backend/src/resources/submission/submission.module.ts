import { SubmissionService } from "./submission.service";
import { SubmissionController } from "./submission.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { SubmissionActionModule } from "../submissionAction/submissionAction.module";
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { FilesCorsMiddleware } from "./submission.service";

@Module({
	imports: [PrismaModule, SubmissionActionModule],
	exports: [SubmissionService],
	controllers: [SubmissionController],
	providers: [SubmissionService, PrismaService],
})
export class SubmissionModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(FilesCorsMiddleware).forRoutes("/files/submissions");
	}
}
