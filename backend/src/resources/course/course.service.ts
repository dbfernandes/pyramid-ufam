import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Course } from "@prisma/client";
import { CreateCourseDto, UpdateCourseDto } from "./dto";
import { CourseActivityGroupService } from "../courseActivityGroup/courseActivityGroup.service";
import { ActivityGroups } from "../../common/enums.enum";
import { ActivityService } from "../activity/activity.service";
import { CreateActivityDto } from "../activity/dto";
import { StatusSubmissions } from "../../../src/common/constants.constants";

@Injectable()
export class CourseService {
	constructor(
		private prisma: PrismaService,
		private courseActivityGroupService: CourseActivityGroupService,
		private activityService: ActivityService,
	) {}

	async updateSearchHash(id: number) {
		const course = await this.findById(id);

		const searchHash = [];

		searchHash.push(course.id);
		searchHash.push(course.name);
		searchHash.push(course.code);
		searchHash.push(course.periods);
		searchHash.push(course.minWorkload);

		await this.prisma.course.update({
			where: { id },
			data: { searchHash: searchHash.join(";") },
		});
	}

	async create(createCourseDto: CreateCourseDto): Promise<any> {
		const existingCourseByName = await this.findByName(createCourseDto.name);
		if (existingCourseByName) {
			throw new BadRequestException("Name already in use");
		}
		const existingCourseByCode = await this.findByCode(createCourseDto.code);
		if (existingCourseByCode) {
			throw new BadRequestException("Code already in use");
		}

		// Se não houver duplicatas, crie o novo curso
		const { activityGroupsWorkloads, ...courseDto } = createCourseDto;
		const activityGroupsArray = Object.keys(ActivityGroups).map((value) =>
			value.toString().toLowerCase(),
		);

		// Criando o curso
		const course = await this.prisma.course.create({ data: courseDto });

		// Definindo a carga horária máxima para cada grupo de atividades
		activityGroupsArray.forEach(async (activityGroup, index) => {
			const value =
				activityGroup in activityGroupsWorkloads
					? activityGroupsWorkloads[activityGroup]
					: 240;

			await this.courseActivityGroupService.create({
				courseId: course.id,
				activityGroupId: index + 1,
				maxWorkload: value,
			});
		});

		const activityGroups = await this.courseActivityGroupService.findByCourseId(
			course.id,
		);

		await this.updateSearchHash(course.id);

		return { ...course, activityGroups: activityGroups };
	}

	async getCourseReport(id: number): Promise<any> {
		const course = await this.findById(id);
		if (!course) throw new BadRequestException("Course not found");

		const totalStudents = await this.prisma.courseUser.count({
			where: {
				courseId: id,
				enrollment: { not: null },
			},
		});

		const submissions = await this.prisma.submission.findMany({
			where: {
				Activity: {
					CourseActivityGroup: {
						Course: {
							id: id,
						},
					},
				},
			},
			select: {
				id: true,
				status: true,
			},
		});

		const totalSubmissions = submissions.length;
		const pendingSubmissions = submissions.filter(
			(submission) => submission.status === StatusSubmissions["Submetido"],
		).length;
		const preApprovedSubmissions = submissions.filter(
			(submission) => submission.status === StatusSubmissions["Pré-aprovado"],
		).length;
		const approvedSubmissions = submissions.filter(
			(submission) => submission.status === StatusSubmissions["Aprovado"],
		).length;
		const rejectedSubmissions = submissions.filter(
			(submission) => submission.status === StatusSubmissions["Rejeitado"],
		).length;

		return {
			course: course,
			totalStudents: totalStudents,
			totalSubmissions: totalSubmissions,
			pendingSubmissions: pendingSubmissions,
			preApprovedSubmissions: preApprovedSubmissions,
			approvedSubmissions: approvedSubmissions,
			rejectedSubmissions: rejectedSubmissions,
		};
	}

	async findAll(query: any): Promise<any> {
		const { page, limit, search } = query;
		const skip = (page - 1) * limit;
		const where =
			search && search.trim() !== ""
				? {
						isActive: true,
						searchHash: { contains: search },
					}
				: { isActive: true };

		const [courses, totalCourses] = await this.prisma.$transaction([
			this.prisma.course.findMany({
				where,
				skip: skip ? skip : undefined,
				take: limit ? parseInt(limit) : undefined,
				select: {
					id: true,
					name: true,
					code: true,
					periods: true,
					minWorkload: true,
					isActive: true,
					createdAt: true,
					updatedAt: true,
					_count: {
						select: {
							CourseUsers: {
								where: { enrollment: { not: null } },
							},
						},
					},
					CourseActivityGroups: {
						include: {
							ActivityGroup: { select: { id: true, name: true } },
						},
					},
				},
			}),
			this.prisma.course.count({
				where,
			}),
		]);

		const _courses = courses.map((course) => {
			const activityGroups = course.CourseActivityGroups.map((cag) => ({
				name: cag.ActivityGroup.name,
				maxWorkload: cag.maxWorkload,
			}));

			return {
				...course,
				activityGroups: activityGroups,
				userCount: course._count.CourseUsers,
				_count: undefined,
				CourseActivityGroups: undefined,
			};
		});

		return {
			courses: _courses.filter(
				(course) => course !== undefined && course !== null,
			),
			total: totalCourses,
			totalPages: Math.ceil(totalCourses / limit),
			currentPage: parseInt(page),
		};
	}

	async findById(id: number): Promise<Course | null | any> {
		const course = await this.prisma.course.findUnique({
			where: { id, isActive: true },
			select: {
				id: true,
				name: true,
				code: true,
				periods: true,
				minWorkload: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						CourseUsers: {
							where: { enrollment: { not: null } },
						},
					},
				},
				CourseActivityGroups: {
					include: {
						ActivityGroup: { select: { id: true, name: true } },
					},
				},
			},
		});

		const activityGroups = course.CourseActivityGroups.map((cag) => ({
			name: cag.ActivityGroup.name,
			maxWorkload: cag.maxWorkload,
		}));

		return {
			...course,
			activityGroups: activityGroups,
			userCount: course._count.CourseUsers,
			_count: undefined,
			CourseActivityGroups: undefined,
		};
	}

	async findByName(
		name: string,
		excludeId: number = 0,
	): Promise<Course | null> {
		return await this.prisma.course.findFirst({
			where: { name, id: { not: excludeId }, isActive: true },
		});
	}

	async findByCode(
		code: string,
		excludeId: number = 0,
	): Promise<Course | null> {
		return await this.prisma.course.findFirst({
			where: { code, id: { not: excludeId }, isActive: true },
		});
	}

	async findCoursesByUser(userId: number): Promise<any[]> {
		const courseUsers = await this.prisma.courseUser.findMany({
			where: { userId },
			select: {
				courseId: true,
				enrollment: true,
				startYear: true,
			},
		});

		const courseIds = courseUsers.map((cu) => cu.courseId);

		const courses = await this.prisma.course.findMany({
			where: {
				id: {
					in: courseIds,
				},
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				code: true,
				periods: true,
				minWorkload: true,
			},
		});

		// Anexar informações de inscrição e data de início aos cursos
		const coursesWithEnrollmentInfo = courses.map((course) => ({
			...course,
			enrollment: courseUsers.find((cu) => cu.courseId === course.id)
				?.enrollment,
			startYear: courseUsers.find((cu) => cu.courseId === course.id)?.startYear,
		}));

		return coursesWithEnrollmentInfo;
	}

	async findActivitiesByCourseAndActivityGroup(
		courseId: number,
		activityGroupName: string,
	): Promise<any[]> {
		const activityGroupsArray = Object.keys(ActivityGroups).map((value) =>
			value.toString(),
		);
		const activityGroupId =
			activityGroupsArray.indexOf(activityGroupName.toUpperCase()) + 1;

		const courseActivityGroup =
			await this.courseActivityGroupService.findByCourseAndActivityGroup(
				courseId,
				activityGroupId,
			);

		if (!courseActivityGroup) return [];
		else {
			return await this.activityService.findByCourseActivityGroupId(
				courseActivityGroup.id,
			);
		}
	}

	async createActivityByCourseAndActivityGroup(
		courseId: number,
		activityGroupName: string,
		createActivityDto: CreateActivityDto,
	): Promise<any> {
		const activityGroupsArray = Object.keys(ActivityGroups).map((value) =>
			value.toString(),
		);
		const activityGroupId =
			activityGroupsArray.indexOf(activityGroupName.toUpperCase()) + 1;

		const courseActivityGroup =
			await this.courseActivityGroupService.findByCourseAndActivityGroup(
				courseId,
				activityGroupId,
			);

		if (!courseActivityGroup)
			throw new BadRequestException("Activity group not found");

		return await this.activityService.create({
			...createActivityDto,
			courseActivityGroupId: courseActivityGroup.id,
		});
	}

	async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
		const course = await this.findById(id);
		if (!course) throw new BadRequestException("Course not found");
		if (await this.findByName(updateCourseDto.name, id))
			throw new BadRequestException("Name already in use");
		if (await this.findByCode(updateCourseDto.code, id))
			throw new BadRequestException("Code already in use");

		const { activityGroupsWorkloads, ...courseDto } = updateCourseDto;
		const activityGroupsArray = Object.keys(ActivityGroups).map((value) =>
			value.toString().toLowerCase(),
		);

		// Updating course
		await this.prisma.course.update({ where: { id }, data: courseDto });

		// Setting max workload for each activity group
		activityGroupsArray.forEach(async (activityGroup, index) => {
			if (activityGroup in activityGroupsWorkloads) {
				const value = activityGroupsWorkloads[activityGroup];
				const courseActivityGroup =
					await this.courseActivityGroupService.findByCourseAndActivityGroup(
						id,
						index + 1,
					);

				if (courseActivityGroup) {
					await this.courseActivityGroupService.update(courseActivityGroup.id, {
						activityGroupId: index + 1,
						maxWorkload: value,
					});
				}
			}
		});

		const activityGroups =
			await this.courseActivityGroupService.findByCourseId(id);

		await this.updateSearchHash(id);

		return { ...course, activityGroups: activityGroups };
	}

	async remove(id: number): Promise<Course> {
		return await this.prisma.course.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
