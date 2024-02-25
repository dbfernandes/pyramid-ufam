import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseActivityGroupModule } from "../courseActivityGroup/courseActivityGroup.module";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ActivityModule } from "../activity/activity.module";
import { SubmissionModule } from "../submission/submission.module";

@Module({
	imports: [
		PrismaModule,
		CourseActivityGroupModule,
		ActivityModule,
		SubmissionModule,
	],
	exports: [CourseService],
	controllers: [CourseController],
	providers: [CourseService, PrismaService],
})
export class CourseModule {}
