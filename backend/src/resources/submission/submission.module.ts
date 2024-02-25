import { Module } from "@nestjs/common";
import { SubmissionService } from "./submission.service";
import { SubmissionController } from "./submission.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { SubmissionActionModule } from "../submissionAction/submissionAction.module";

@Module({
	imports: [PrismaModule, SubmissionActionModule],
	exports: [SubmissionService],
	controllers: [SubmissionController],
	providers: [SubmissionService, PrismaService],
})
export class SubmissionModule {}
