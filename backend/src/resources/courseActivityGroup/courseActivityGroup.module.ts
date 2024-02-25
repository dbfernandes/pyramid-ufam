import { Module } from "@nestjs/common";
import { CourseActivityGroupService } from "./courseActivityGroup.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule, CourseActivityGroupModule],
	exports: [CourseActivityGroupService],
	providers: [CourseActivityGroupService, PrismaService],
})
export class CourseActivityGroupModule {}
