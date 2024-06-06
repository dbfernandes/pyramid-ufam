// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CourseModule } from "./resources/course/course.module";
import { UserTypeModule } from "./resources/userType/userType.module";
import { UserModule } from "./resources/user/user.module";
import { AuthModule } from "./resources/auth/auth.module";
import { SubmissionActionModule } from "./resources/submissionAction/submissionAction.module";
import { SubmissionActionTypeModule } from "./resources/submissionActionType/submissionActionType.module";
import { ActivityGroupModule } from "./resources/activityGroup/activityGroup.module";
import { CourseActivityGroupModule } from "./resources/courseActivityGroup/courseActivityGroup.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { CronService } from "./resources/cron/cron.service";
import { PrismaService } from "./resources/prisma/prisma.service";

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "public"),
			serveRoot: "/files",
		}),
		ConfigModule.forRoot(),

		AuthModule,
		UserModule,
		UserTypeModule,

		CourseModule,
		ActivityGroupModule,
		CourseActivityGroupModule,

		SubmissionActionModule,
		SubmissionActionTypeModule,
	],
	providers: [CronService, PrismaService],
})
export class AppModule {}
