import { Module } from "@nestjs/common";
import { SubmissionActionTypeService } from "./submissionActionType.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	exports: [SubmissionActionTypeService],
	providers: [SubmissionActionTypeService, PrismaService],
})
export class SubmissionActionTypeModule {}
