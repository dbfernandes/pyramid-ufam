import { Module } from "@nestjs/common";
import { CourseUserService } from "./courseUser.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	exports: [CourseUserService],
	providers: [CourseUserService, PrismaService],
})
export class CourseUserModule {}
