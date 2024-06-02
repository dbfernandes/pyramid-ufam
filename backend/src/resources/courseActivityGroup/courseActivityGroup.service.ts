import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CourseActivityGroup } from "@prisma/client";
import {
	CreateCourseActivityGroupDto,
	UpdateCourseActivityGroupDto,
} from "./dto";

@Injectable()
export class CourseActivityGroupService {
	constructor(private prisma: PrismaService) {}

	async create(
		createCourseActivityGroupDto: CreateCourseActivityGroupDto,
	): Promise<CourseActivityGroup> {
		return await this.prisma.courseActivityGroup.create({
			data: createCourseActivityGroupDto,
		});
	}

	async findAll(): Promise<CourseActivityGroup[]> {
		return await this.prisma.courseActivityGroup.findMany({
			where: { isActive: true },
		});
	}

	async findById(id: number): Promise<CourseActivityGroup | null> {
		return await this.prisma.courseActivityGroup.findUnique({
			where: { id, isActive: true },
		});
	}

	async findByCourseId(
		courseId: number,
	): Promise<CourseActivityGroup[] | any[]> {
		return await this.prisma.courseActivityGroup.findMany({
			where: { courseId, isActive: true },
			include: {
				ActivityGroup: true,
			},
		});
	}

	async findByCourseAndActivityGroup(
		courseId: number,
		activityGroupId: number,
	): Promise<CourseActivityGroup | null> {
		return await this.prisma.courseActivityGroup.findFirst({
			where: { courseId, activityGroupId, isActive: true },
		});
	}

	async update(
		id: number,
		updateCourseActivityGroupDto: UpdateCourseActivityGroupDto,
	): Promise<CourseActivityGroup> {
		return await this.prisma.courseActivityGroup.update({
			where: { id },
			data: updateCourseActivityGroupDto,
		});
	}
}
