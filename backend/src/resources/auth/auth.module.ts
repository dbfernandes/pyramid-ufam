import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { CourseUserModule } from "../courseUser/courseUser.module";
import { CourseModule } from "../course/course.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	imports: [
		forwardRef(() => UserModule),
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
