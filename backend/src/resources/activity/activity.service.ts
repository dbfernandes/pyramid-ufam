import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Activity } from "@prisma/client";
import { CreateActivityDto, UpdateActivityDto } from "./dto";

@Injectable()
export class ActivityService {
	constructor(private prisma: PrismaService) {}

	create(createActivityDto: CreateActivityDto): Promise<Activity> {
		return this.prisma.activity.create({ data: createActivityDto });
	}

	findAll(): Promise<Activity[]> {
		return this.prisma.activity.findMany({ where: { isActive: true } });
	}

	findById(id: number): Promise<Activity | null> {
		return this.prisma.activity.findUnique({ where: { id, isActive: true } });
	}

	async findByCourseActivityGroupId(
		courseActivityGroupId: number,
	): Promise<Activity[]> {
		return await this.prisma.activity.findMany({
			where: { courseActivityGroupId, isActive: true },
		});
	}

	update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
		return this.prisma.activity.update({
			where: { id },
			data: updateActivityDto,
		});
	}

	remove(id: number): Promise<Activity> {
		return this.prisma.activity.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
