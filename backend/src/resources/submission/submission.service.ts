import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Submission } from "@prisma/client";
import { CreateSubmissionDto, UpdateSubmissionDto } from "./dto";
import { UpdateStatusDto } from "./dto/update-status.dto";
import { SubmissionActionService } from "../submissionAction/submissionAction.service";
import {
	ActivityGroupIds,
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

	async findById(id: number): Promise<any> {
		const _submission = await this.prisma.submission.findUnique({
			where: { id },
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
				SubmissionActions: {
					include: {
						SubmissionActionType: true,
						User: true,
					},

					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		if (_submission) {
			const { User, Activity, SubmissionActions, file } = _submission;
			const { CourseActivityGroup } = Activity;
			const { Course, ActivityGroup } = CourseActivityGroup;

			const _userCourse = User.CourseUsers[0];

			const _submissionActions = SubmissionActions.map((action) => {
				const { User, SubmissionActionType } = action;
				return {
					user: {
						id: User.id,
						name: User.name,
						email: User.email,
						userTypeId: User.userTypeId,
					},
					action: SubmissionActionType.name,
					details: action.details,
					createdAt: action.createdAt,
				};
			});

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
				history: _submissionActions,
				fileUrl: `${process.env.NODE_HOST}${
					process.env.BACKEND_PORT ? ":" + process.env.BACKEND_PORT : ""
				}/files/submissions/${file}`,
				..._submission,
				Activity: undefined,
				User: undefined,
				SubmissionActions: undefined,
			};
		}
	}

	async findAll(query: any): Promise<any> {
		const {
			page,
			limit,
			search,
			userId,
			courseId,
			activityGroup,
			activity,
			status,
		} = query;
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
				: { isActive: true, User: { is: { isActive: true } } };

		if (userId && !isNaN(parseInt(userId))) {
			where = {
				...where,
				userId: parseInt(userId),
			};
		}
		if (courseId && !isNaN(parseInt(courseId))) {
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
		if (activityGroup && activityGroup.length > 0) {
			where = {
				...where,
				Activity: {
					CourseActivityGroup: {
						activityGroupId: ActivityGroupIds[activityGroup],
					},
				},
			};
		}
		if (activity && !isNaN(parseInt(activity))) {
			where = {
				...where,
				activityId: parseInt(activity),
			};
		}
		if (status && status.length > 0) {
			const statusArray = status.split("-").map(Number);
			where = {
				...where,
				status: {
					in: statusArray,
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
					process.env.BACKEND_PORT ? ":" + process.env.BACKEND_PORT : ""
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
		const { status, userId, details } = updateStatusDto;

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
			details,
		});

		return submission;
	}

	async massUpdateStatus(ids: string, updateStatusDto: UpdateStatusDto) {
		const { status, userId } = updateStatusDto;
		const statusId = StatusSubmissions[status];
		const _ids = ids.split(",").map(Number);

		const submissions = await this.prisma.submission.updateMany({
			where: { id: { in: _ids } },
			data: { status: statusId },
		});

		// Adding to history for each submission
		_ids.forEach((id) => {
			this.submissionActionService.create({
				userId,
				submissionId: id,
				submissionActionTypeId: statusId,
			});
		});

		return submissions;
	}

	async update(
		id: number,
		updateSubmissionDto: UpdateSubmissionDto,
	): Promise<Submission> {
		return await this.prisma.submission.update({
			where: { id },
			data: updateSubmissionDto,
		});
	}

	async remove(id: number): Promise<Submission> {
		return await this.prisma.submission.update({
			where: { id },
			data: { isActive: false },
		});
	}

	async massRemove(ids: string): Promise<Submission[]> {
		const _ids = ids.split(",").map(Number);
		return await Promise.all(
			_ids.map((id) =>
				this.prisma.submission.update({
					where: { id },
					data: { isActive: false },
				}),
			),
		);
	}
}
