import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Activity } from "@prisma/client";
import { CreateActivityDto, UpdateActivityDto } from "./dto";

@Injectable()
export class ActivityService {
	constructor(private prisma: PrismaService) {}

	async create(createActivityDto: CreateActivityDto): Promise<Activity> {
		return await this.prisma.activity.create({ data: createActivityDto });
	}

	async findAll(): Promise<Activity[]> {
		return await this.prisma.activity.findMany({ where: { isActive: true } });
	}

	async findById(id: number): Promise<Activity | null> {
		return await this.prisma.activity.findUnique({
			where: { id, isActive: true },
		});
	}

	async findByCourseActivityGroupId(
		courseActivityGroupId: number,
	): Promise<Activity[]> {
		return await this.prisma.activity.findMany({
			where: { courseActivityGroupId, isActive: true },
		});
	}

	async update(
		id: number,
		updateActivityDto: UpdateActivityDto,
	): Promise<Activity> {
		return await this.prisma.activity.update({
			where: { id },
			data: updateActivityDto,
		});
	}

	async remove(id: number): Promise<Activity> {
		return await this.prisma.activity.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
