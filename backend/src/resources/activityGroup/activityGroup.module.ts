import { Module } from "@nestjs/common";
import { ActivityGroupService } from "./activityGroup.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule, ActivityGroupModule],
	exports: [ActivityGroupService],
	providers: [ActivityGroupService, PrismaService],
})
export class ActivityGroupModule {}
