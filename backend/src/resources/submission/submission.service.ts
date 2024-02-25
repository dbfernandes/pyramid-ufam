import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Submission } from "@prisma/client";
import { CreateSubmissionDto, UpdateSubmissionDto } from "./dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { SubmissionActionService } from "../submissionAction/submissionAction.service";
import {
	StatusSubmissions,
	SubmissionActionIds,
} from "src/common/constants.constants";

@Injectable()
export class SubmissionService {
	constructor(
		private prisma: PrismaService,
		private submissionActionService: SubmissionActionService,
	) {}

	async submit(
		userId: number,
		createSubmissionDto: CreateSubmissionDto,
		filename: string,
	) {
		const { activityId, workload, description, details } = createSubmissionDto;
		const submission = await this.prisma.submission.create({
			data: {
				description,
				details,
				workload: parseInt(workload.toString()),
				activityId: parseInt(activityId.toString()),
				userId,
				file: filename,
			},
		});

		// Adding to history
		await this.submissionActionService.create({
			userId,
			submissionId: submission.id,
			submissionActionTypeId: SubmissionActionIds["submeteu"],
		});

		return submission;
	}

	findById(id: number): Promise<Submission | null> {
		return this.prisma.submission.findUnique({ where: { id } });
	}

	async findAll(query: any): Promise<any> {
		const { page, limit, search, userId, courseId } = query;
		const skip = (page - 1) * limit;
		let where: any =
			search && search.trim() !== ""
				? {
						isActive: true,
						OR: [
							{ description: { contains: search } },
							{ details: { contains: search } },
						],
					}
				: { isActive: true };

		if (userId && !isNaN(parseInt(userId))) {
			// where["userId"] = parseInt(userId);
			where = {
				...where,
				userId: parseInt(userId),
			};
		}
		if (courseId && !isNaN(parseInt(courseId))) {
			// where["Activity"]["CourseActivityGroup"]["Course"]["id"] = parseInt(courseId);
			where = {
				...where,
				Activity: {
					CourseActivityGroup: {
						Course: {
							id: parseInt(courseId),
						},
					},
				},
			};
		}

		const [submissions, totalSubmissions] = await this.prisma.$transaction([
			this.prisma.submission.findMany({
				where,
				skip: skip ? skip : undefined,
				take: limit ? parseInt(limit) : undefined,
				include: {
					Activity: {
						include: {
							CourseActivityGroup: {
								include: {
									Course: {
										select: { id: true, code: true, name: true },
									},
									ActivityGroup: {
										select: { name: true },
									},
								},
							},
						},
					},
					User: {
						include: {
							CourseUsers: {
								include: {
									Course: {},
								},
							},
						},
					},
				},
			}),
			this.prisma.submission.count({
				where,
			}),
		]);

		const _submissions = submissions.map((submission) => {
			const { User, Activity, file } = submission;
			const { CourseActivityGroup } = Activity;
			const { Course, ActivityGroup } = CourseActivityGroup;

			const _userCourse = User.CourseUsers[0];

			return {
				user: {
					id: User.id,
					name: User.name,
					email: User.email,
					cpf: User.cpf,
					course: _userCourse.Course.name,
					enrollment: _userCourse.enrollment,
				},
				activity: {
					name: Activity.name,
					maxWorkload: Activity.maxWorkload,
					description: Activity.description,
					course: {
						id: Course.id,
						code: Course.code,
						name: Course.name,
					},
					activityGroup: {
						name: ActivityGroup.name,
						maxWorkload: CourseActivityGroup.maxWorkload,
					},
				},
				fileUrl: `${process.env.NODE_HOST}${
					process.env.PORT ? ":" + process.env.PORT : ""
				}/files/submissions/${file}`,
				...submission,
				Activity: undefined,
				User: undefined,
			};
		});

		return {
			submissions: _submissions,
			total: totalSubmissions,
			totalPages: Math.ceil(totalSubmissions / limit),
			currentPage: parseInt(page),
		};
	}

	async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
		const { status, userId } = updateStatusDto;

		const statusId = StatusSubmissions[status];

		const submission = await this.prisma.submission.update({
			where: { id },
			data: { status: statusId },
		});

		// Adding to history
		await this.submissionActionService.create({
			userId,
			submissionId: submission.id,
			submissionActionTypeId: statusId,
		});

		return submission;
	}

	update(
		id: number,
		updateSubmissionDto: UpdateSubmissionDto,
	): Promise<Submission> {
		return this.prisma.submission.update({
			where: { id },
			data: updateSubmissionDto,
		});
	}

	remove(id: number): Promise<Submission> {
		return this.prisma.submission.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
