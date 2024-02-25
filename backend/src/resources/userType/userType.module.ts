import { Module } from "@nestjs/common";
import { UserTypeService } from "./userType.service";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	exports: [UserTypeService],
	providers: [UserTypeService, PrismaService],
})
export class UserTypeModule {}
