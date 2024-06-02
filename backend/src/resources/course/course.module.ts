import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseActivityGroupModule } from "../courseActivityGroup/courseActivityGroup.module";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ActivityModule } from "../activity/activity.module";
import { SubmissionModule } from "../submission/submission.module";
import { JwtStrategy } from "../../../src/guards/strategies/jwt.strategy";
import { ActivityGroupModule } from "../activityGroup/activityGroup.module";

@Module({
	imports: [
		PrismaModule,
		CourseActivityGroupModule,
		ActivityModule,
		ActivityGroupModule,
		SubmissionModule,
	],
	exports: [CourseService],
	controllers: [CourseController],
	providers: [CourseService, PrismaService, JwtStrategy],
})
export class CourseModule {}
