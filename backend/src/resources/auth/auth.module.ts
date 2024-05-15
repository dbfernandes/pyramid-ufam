import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { CourseUserModule } from "../courseUser/courseUser.module";
import { CourseModule } from "../course/course.module";
import { PrismaService } from "../prisma/prisma.service";
import { JwtStrategy } from "../../../src/guards/strategies/jwt.strategy";
import { UserTypeModule } from "../userType/userType.module";

@Module({
	imports: [
		forwardRef(() => UserModule),
		UserTypeModule,
		CourseModule,
		CourseUserModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "1h" },
		}),
	],
	exports: [AuthService],
	controllers: [AuthController],
	providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
