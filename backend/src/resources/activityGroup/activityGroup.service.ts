import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ActivityGroup } from "@prisma/client";

@Injectable()
export class ActivityGroupService {
	constructor(private prisma: PrismaService) {}

	async findAll(): Promise<ActivityGroup[]> {
		return await this.prisma.activityGroup.findMany();
	}

	async findById(id: number): Promise<ActivityGroup | null> {
		return await this.prisma.activityGroup.findUnique({ where: { id } });
	}
}
