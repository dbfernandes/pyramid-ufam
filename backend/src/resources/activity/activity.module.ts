import { Module } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule, ActivityModule],
	exports: [ActivityService],
	controllers: [ActivityController],
	providers: [ActivityService, PrismaService],
})
export class ActivityModule {}
