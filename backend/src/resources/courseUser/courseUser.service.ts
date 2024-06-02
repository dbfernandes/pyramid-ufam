import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CourseUser } from "@prisma/client";
import { CreateCourseUserDto, UpdateCourseUserDto } from "./dto";

@Injectable()
export class CourseUserService {
	constructor(private prisma: PrismaService) {}

	create(createCourseUserDto: CreateCourseUserDto): Promise<CourseUser> {
		return this.prisma.courseUser.create({ data: createCourseUserDto });
	}

	findAll(): Promise<CourseUser[]> {
		return this.prisma.courseUser.findMany();
	}

	findById(id: number): Promise<CourseUser | null> {
		return this.prisma.courseUser.findUnique({ where: { id } });
	}

	findByEnrollment(
		enrollment: string,
		excludeId: number = 0,
	): Promise<CourseUser | null> {
		return this.prisma.courseUser.findFirst({
			where: { enrollment, id: { not: excludeId } },
		});
	}

	async findByUserIdAndCourseId(
		userId: number,
		courseId: number,
	): Promise<CourseUser | null> {
		return await this.prisma.courseUser.findFirst({
			where: { userId, courseId },
		});
	}

	async update(
		id: number,
		updateCourseUserDto: UpdateCourseUserDto,
	): Promise<CourseUser> {
		return await this.prisma.courseUser.update({
			where: { id },
			data: updateCourseUserDto,
		});
	}

	async unlinkUserFromCourse(userId: number, courseId: number): Promise<any> {
		const courseUser = await this.findByUserIdAndCourseId(userId, courseId);

		if (!courseUser)
			throw new BadRequestException("User not enrolled in course");

		return await this.prisma.courseUser.delete({
			where: {
				id: courseUser.id,
			},
		});
	}

	remove(id: number): Promise<CourseUser> {
		return this.prisma.courseUser.delete({ where: { id } });
	}
}
