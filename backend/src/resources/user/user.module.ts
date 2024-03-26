import { Module, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UserTypeModule } from "../userType/userType.module";
import { SubmissionModule } from "../submission/submission.module";
import { CourseModule } from "../course/course.module";
import { CourseUserModule } from "../courseUser/courseUser.module";
import { AuthModule } from "../auth/auth.module";
import { CourseActivityGroupModule } from "../courseActivityGroup/courseActivityGroup.module";

@Module({
	imports: [
		PrismaModule,
		forwardRef(() => AuthModule),
		UserTypeModule,
		SubmissionModule,
		CourseModule,
		CourseUserModule,
		CourseActivityGroupModule,
	],
	exports: [UserService],
	controllers: [UserController],
	providers: [UserService, PrismaService],
})
export class UserModule {}
