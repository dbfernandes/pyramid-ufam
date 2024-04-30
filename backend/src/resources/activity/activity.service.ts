import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Activity } from "@prisma/client";
import { CreateActivityDto, UpdateActivityDto } from "./dto";

@Injectable()
export class ActivityService {
	constructor(private prisma: PrismaService) {}

	async updateSearchHash(id: number) {
		const activity = await this.findById(id);

		const searchHash = [];

		searchHash.push(activity.id);
		searchHash.push(activity.name);
		searchHash.push(activity.description);
		searchHash.push(activity.maxWorkload);

		await this.prisma.activity.update({
			where: { id },
			data: { searchHash: searchHash.join(";") },
		});
	}

	async create(createActivityDto: CreateActivityDto): Promise<Activity> {
		const activity = await this.prisma.activity.create({
			data: createActivityDto,
		});

		this.updateSearchHash(activity.id);

		return activity;
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
		const activity = await this.prisma.activity.update({
			where: { id },
			data: updateActivityDto,
		});

		this.updateSearchHash(activity.id);

		return activity;
	}

	async remove(id: number): Promise<Activity> {
		return await this.prisma.activity.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
