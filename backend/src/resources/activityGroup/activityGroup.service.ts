import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ActivityGroup } from "@prisma/client";

@Injectable()
export class ActivityGroupService {
	constructor(private prisma: PrismaService) {}

	findAll(): Promise<ActivityGroup[]> {
		return this.prisma.activityGroup.findMany();
	}

	findById(id: number): Promise<ActivityGroup | null> {
		return this.prisma.activityGroup.findUnique({ where: { id } });
	}
}
