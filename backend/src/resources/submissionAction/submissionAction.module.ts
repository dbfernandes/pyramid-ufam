import { Module } from "@nestjs/common";
import { SubmissionActionService } from "./submissionAction.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	exports: [SubmissionActionService],
	providers: [SubmissionActionService, PrismaService],
})
export class SubmissionActionModule {}
