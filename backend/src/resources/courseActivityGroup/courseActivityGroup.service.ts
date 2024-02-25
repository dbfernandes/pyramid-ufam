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

	create(
		createCourseActivityGroupDto: CreateCourseActivityGroupDto,
	): Promise<CourseActivityGroup> {
		return this.prisma.courseActivityGroup.create({
			data: createCourseActivityGroupDto,
		});
	}

	findAll(): Promise<CourseActivityGroup[]> {
		return this.prisma.courseActivityGroup.findMany({
			where: { isActive: true },
		});
	}

	findById(id: number): Promise<CourseActivityGroup | null> {
		return this.prisma.courseActivityGroup.findUnique({
			where: { id, isActive: true },
		});
	}

	findByCourseId(courseId: number): Promise<CourseActivityGroup[]> {
		return this.prisma.courseActivityGroup.findMany({
			where: { courseId, isActive: true },
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
