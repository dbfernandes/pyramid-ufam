import { Module } from "@nestjs/common";
import { ActivityGroupService } from "./activityGroup.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ActivityGroupController } from "./activityGroup.controller";

@Module({
	imports: [PrismaModule, ActivityGroupModule],
	exports: [ActivityGroupService],
	controllers: [ActivityGroupController],
	providers: [ActivityGroupService, PrismaService],
})
export class ActivityGroupModule {}
