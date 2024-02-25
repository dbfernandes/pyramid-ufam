import { Module } from "@nestjs/common";
import { SubmissionActionService } from "./submissionAction.service";
import { SubmissionActionController } from "./submissionAction.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	exports: [SubmissionActionService],
	controllers: [SubmissionActionController],
	providers: [SubmissionActionService, PrismaService],
})
export class SubmissionActionModule {}
