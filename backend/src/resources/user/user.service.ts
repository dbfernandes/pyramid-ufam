import {
	BadRequestException,
	Inject,
	Injectable,
	forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { AddUserDto, CreateUserDto, UpdateUserDto } from "./dto";
import { UserTypeService } from "../userType/userType.service";
import { UserTypes } from "../../../src/common/enums.enum";
import { CourseService } from "../course/course.service";
import { CourseUserService } from "../courseUser/courseUser.service";
import { CourseActivityGroupService } from "../courseActivityGroup/courseActivityGroup.service";
import {
	StatusSubmissions,
	UserTypeIds,
} from "../../../src/common/constants.constants";
import { EnrollDto } from "./dto/enroll.dto";
import {
	decodeToken,
	getFilesLocation,
	getFirstAndLastName,
	getFirstName,
	sendEmail,
} from "../utils";
import { AuthService } from "../auth/auth.service";
import * as fs from "fs";
import * as sharp from "sharp";

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private userTypeService: UserTypeService,
		private courseService: CourseService,
		private courseActivityGroupService: CourseActivityGroupService,
		private courseUserService: CourseUserService,

		@Inject(forwardRef(() => AuthService))
		private authService: AuthService,
	) {}

	async updateSearchHash(id: number) {
		const user = await this.findById(id);
		const courses = await this.courseService.findCoursesByUser(id);

		const searchHash = [];

		searchHash.push(user.id);
		searchHash.push(user.name);
		searchHash.push(user.email);
		searchHash.push(user.cpf);

		courses.forEach((course) => {
			searchHash.push(course.name);
			searchHash.push(course.enrollment);
			searchHash.push(course.startYear);
		});

		await this.prisma.user.update({
			where: { id },
			data: { searchHash: searchHash.join(";") },
		});
	}

	async addUser(addUserDto: AddUserDto, token: string = ""): Promise<any> {
		if (await this.findByEmail(addUserDto.email)) {
			throw new BadRequestException("Email already in use");
		}
		if (addUserDto.cpf && (await this.findByCpf(addUserDto.cpf))) {
			throw new BadRequestException("CPF already in use");
		}
		if (
			addUserDto.courseId &&
			!(await this.courseService.findById(addUserDto.courseId))
		) {
			throw new BadRequestException("Course not found");
		}
		if (addUserDto.coursesIds) {
			for (const _courseId of addUserDto.coursesIds) {
				if (!(await this.courseService.findById(_courseId))) {
					throw new BadRequestException(`Course (id: ${_courseId}) not found`);
				}
			}
		}
		if (
			addUserDto.enrollment &&
			(await this.courseUserService.findByEnrollment(addUserDto.enrollment))
		) {
			throw new BadRequestException("Enrollment already in use");
		}

		const {
			coursesIds,
			courseId,
			enrollment,
			startYear,
			password,
			userType,
			..._addUserDto
		} = addUserDto;

		// Registering user
		const userCreated = await this.create({
			..._addUserDto,
			cpf: addUserDto.cpf ? addUserDto.cpf.replace(/\D/g, "") : null,
			password: password ? password : null,
			userTypeId: UserTypeIds[userType],
		});

		if (userType === UserTypes.STUDENT) {
			// Registering course
			await this.courseUserService.create({
				courseId,
				enrollment,
				startYear,
				userId: userCreated.id,
			});
		} else {
			// Registering courses
			coursesIds.forEach(async (_courseId) => {
				await this.courseUserService.create({
					courseId: _courseId,
					userId: userCreated.id,
					enrollment: null,
					startYear: null,
				});
			});
		}

		const userResponsible = await this.findById((decodeToken(token) as any).id);
		if (userResponsible) {
			// Setting password reset token and sending welcome email
			const resetToken = await this.authService.createPasswordResetToken(
				userCreated.email,
				48,
			);

			await this.sendWelcomeEmail(userResponsible, userCreated, resetToken);
		}

		const courses = await this.courseService
			.findCoursesByUser(userCreated.id)
			.then(() => this.updateSearchHash(userCreated.id));

		return {
			user: {
				...userCreated,
				courses,
				profileImage: userCreated.profileImage
					? `${getFilesLocation("profile-images")}/${userCreated.profileImage}`
					: null,
			},
		};
	}

	async sendWelcomeEmail(
		userResponsible: any,
		userCreated: any,
		resetToken: string,
	): Promise<void> {
		const userType = UserTypeIds[userResponsible.userTypeId].toLowerCase();
		const userCreatedType = UserTypeIds[userCreated.userTypeId].toLowerCase();

		await sendEmail(
			userCreated.email,
			"Bem vindo ao Pyramid!",
			`Olá, ${getFirstName(
				userCreated.name,
			)}! Você foi adicionado como ${userCreatedType} na nossa plataforma pelo ${userType} ${getFirstAndLastName(
				userResponsible.name,
			)}. 
      Para configurar sua senha e começar a gerenciar suas atividades extracurriculares, clique no link a seguir: ${
				process.env.FRONTEND_URL
			}/conta/senha?token=${resetToken}`,
		);
	}

	async create(createUserDto: CreateUserDto): Promise<any> {
		const user = await this.prisma.user.create({ data: createUserDto });
		const userType = await this.userTypeService.findById(
			createUserDto.userTypeId,
		);
		return { ...user, userType };
	}

	async enroll(
		userId: number,
		courseId: number,
		enrollDto: EnrollDto,
	): Promise<any> {
		const user = await this.findById(userId);
		if (!user) throw new BadRequestException("User not found");
		const course = await this.courseService.findById(courseId);
		if (!course) throw new BadRequestException("Course not found");

		const { enrollment, startYear } = enrollDto;

		if (
			enrollment &&
			(await this.courseUserService.findByEnrollment(enrollDto.enrollment))
		) {
			throw new BadRequestException("Enrollment already in use");
		}

		await this.courseUserService
			.create({
				userId,
				courseId,
				enrollment: enrollment ? enrollment : null,
				startYear: startYear ? startYear : null,
			})
			.then(() => this.updateSearchHash(userId));

		return await this.courseService.findCoursesByUser(user.id);
	}

	async updateEnrollment(
		userId: number,
		courseId: number,
		enrollDto: EnrollDto,
	): Promise<any> {
		const user = await this.findById(userId);
		if (!user) throw new BadRequestException("User not found");
		const course = await this.courseService.findById(courseId);
		if (!course) throw new BadRequestException("Course not found");

		const { enrollment, startYear } = enrollDto;

		const courseUser = await this.courseUserService.findByUserIdAndCourseId(
			userId,
			courseId,
		);
		if (!courseUser)
			throw new BadRequestException("User not enrolled in course");

		if (
			enrollment &&
			(await this.courseUserService.findByEnrollment(
				enrollDto.enrollment,
				courseUser.id,
			))
		) {
			throw new BadRequestException("Enrollment already in use");
		}

		await this.courseUserService
			.update(courseUser.id, {
				enrollment,
				startYear,
			})
			.then(() => this.updateSearchHash(userId));

		return await this.courseService.findCoursesByUser(user.id);
	}

	async unenroll(userId: number, courseId: number): Promise<any> {
		const user = await this.findById(userId);
		if (!user) throw new BadRequestException("User not found");
		const course = await this.courseService.findById(courseId);
		if (!course) throw new BadRequestException("Course not found");

		await this.courseUserService
			.unlinkUserFromCourse(userId, courseId)
			.then(() => this.updateSearchHash(userId));

		return await this.courseService.findCoursesByUser(user.id);
	}

	async groupAndCountWorkload(submissions: any[], courseId: number) {
		const activityGroups =
			await this.courseActivityGroupService.findByCourseId(+courseId);

		const workloadCount = { totalWorkload: 0 };
		activityGroups.forEach((_activityGroup) => {
			workloadCount[_activityGroup?.ActivityGroup?.name] = {
				maxWorkload: _activityGroup.maxWorkload,
				totalWorkload: 0,
			};
		});

		submissions.forEach((submission) => {
			const { CourseActivityGroup } = submission.Activity;
			const { ActivityGroup, Course } = CourseActivityGroup;

			if (
				courseId == Course.id &&
				submission.status == StatusSubmissions["Aprovado"]
			) {
				if (!workloadCount[ActivityGroup.name]) {
					workloadCount[ActivityGroup.name] = {
						maxWorkload: CourseActivityGroup.maxWorkload,
						totalWorkload: 0,
					};
				}

				workloadCount[ActivityGroup.name].totalWorkload += submission.workload;
			}
		});

		workloadCount.totalWorkload = Object.values(workloadCount).reduce(
			(acc, activity) => {
				if (
					typeof activity === "object" &&
					activity &&
					(activity as { maxWorkload?: number; totalWorkload?: number })
						?.totalWorkload
				) {
					return (
						acc +
						(activity as { maxWorkload?: number; totalWorkload?: number })
							?.totalWorkload
					);
				}
				return acc;
			},
			0,
		);

		return workloadCount;
	}

	async getUserReport(userId: number, courseId: number) {
		const user = await this.findById(userId);
		if (!user) throw new BadRequestException("User not found");

		const submissions = await this.prisma.submission.findMany({
			where: { userId },
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
			},
		});

		const course = await this.courseService.findById(courseId);
		const courseSubmissions = submissions.filter(
			(submission) =>
				submission.Activity.CourseActivityGroup.Course.id === courseId,
		);

		const totalSubmissions = courseSubmissions.length;
		const pendingSubmissions = courseSubmissions.filter(
			(submission) => submission.status === StatusSubmissions["Submetido"],
		).length;
		const preApprovedSubmissions = courseSubmissions.filter(
			(submission) => submission.status === StatusSubmissions["Pré-aprovado"],
		).length;
		const approvedSubmissions = courseSubmissions.filter(
			(submission) => submission.status === StatusSubmissions["Aprovado"],
		).length;
		const rejectedSubmissions = courseSubmissions.filter(
			(submission) => submission.status === StatusSubmissions["Rejeitado"],
		).length;

		const workloadCount = await this.groupAndCountWorkload(
			courseSubmissions,
			courseId,
		);

		return {
			user: {
				...user,
				profileImage: user.profileImage
					? `${getFilesLocation("profile-images")}/${user.profileImage}`
					: null,
			},
			course,
			workloadCount,
			totalSubmissions,
			pendingSubmissions,
			preApprovedSubmissions,
			approvedSubmissions,
			rejectedSubmissions,
		};
	}

	async findAll(query: any): Promise<any> {
		const { page, limit, search, type, courseId, active } = query;
		const skip = (page - 1) * limit;
		const where =
			search && search.trim() !== ""
				? {
						searchHash: { contains: search },
					}
				: {};

		if (type) {
			const userTypesArray = Object.values(UserTypes).map((value) =>
				value.toString().toLowerCase(),
			);
			where["userTypeId"] =
				userTypesArray.indexOf(type.toString().toLowerCase()) + 1;
		}

		if (courseId && !isNaN(parseInt(courseId))) {
			where["CourseUsers"] = {
				some: {
					courseId: parseInt(courseId),
				},
			};
		}

		if (active !== undefined && active !== null) {
			where["isActive"] = active == "true";
		}

		const [users, totalUsers] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				skip: skip ? skip : undefined,
				take: limit ? parseInt(limit) : undefined,
				include: {
					UserType: { select: { id: true, name: true } },
					CourseUsers: {
						include: {
							Course: { select: { id: true, name: true } },
						},
					},
					Submissions: {
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
						},
					},
				},
			}),
			this.prisma.user.count({
				where,
			}),
		]);

		const _users = await Promise.all(
			users.map(async (user) => {
				const courses = user.CourseUsers.map((courseUser) => ({
					id: courseUser.Course.id,
					name: courseUser.Course.name,
					enrollment: courseUser.enrollment,
					startYear: courseUser.startYear,
				}));

				return {
					...user,
					profileImage: user.profileImage
						? `${getFilesLocation("profile-images")}/${user.profileImage}`
						: null,
					courses,
					CourseUsers: undefined,
					password: undefined,
					userType: user.UserType,
					UserType: undefined,
					workloadCount:
						user.userTypeId === UserTypeIds.Aluno
							? await this.groupAndCountWorkload(user.Submissions, +courseId)
							: undefined,
					Submissions: undefined,
				};
			}),
		);

		return {
			users: _users.filter((user) => user !== undefined && user !== null),
			total: totalUsers,
			totalPages: Math.ceil(totalUsers / limit),
			currentPage: parseInt(page),
		};
	}

	async findById(id: number): Promise<any | null> {
		return await this.prisma.user.findUnique({ where: { id, isActive: true } });
	}

	// Used to verify availability
	async findByEmail(
		email: string,
		excludeId: number = 0,
	): Promise<User | null> {
		const user = await this.prisma.user.findFirst({
			where: { email, id: { not: excludeId } },
			include: {
				UserType: { select: { id: true, name: true } },
			},
		});
		return user;
	}

	// Used to verify availability
	async findByCpf(cpf: string, excludeId: number = 0): Promise<User | null> {
		return await this.prisma.user.findFirst({
			where: { cpf, id: { not: excludeId } },
		});
	}

	async findByResetToken(token: string): Promise<User | null> {
		return await this.prisma.user.findFirst({
			where: { resetToken: token, isActive: true },
		});
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
		if (
			updateUserDto.email &&
			(await this.findByEmail(updateUserDto.email, id))
		)
			throw new BadRequestException("Email already in use");
		if (updateUserDto.cpf && (await this.findByCpf(updateUserDto.cpf, id)))
			throw new BadRequestException("CPF already in use");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});

		await this.updateSearchHash(id);

		return {
			...user,
			profileImage: user.profileImage
				? `${getFilesLocation("profile-images")}/${user.profileImage}`
				: null,
			password: undefined,
		};
	}

	async updateProfileImage(id: number, filename: string) {
		const tmpPath = `./public/files/tmp/`;
		const rootPath = `./public/files/profile-images/`;
		const path = `${rootPath}${filename}`;

		if (!fs.existsSync(rootPath)) {
			fs.mkdirSync(rootPath, { recursive: true });
		}

		const user = await this.findById(id);
		if (!user) {
			throw new BadRequestException("User not found");
		}

		if (user && user.profileImage) {
			const currentImagePath = `${rootPath}${user.profileImage}`;
			if (fs.existsSync(currentImagePath)) {
				fs.unlinkSync(currentImagePath);
			}
		}

		const resizedImage = await sharp(`${tmpPath}${filename}`)
			.resize({
				fit: "cover",
				width: 250,
				height: 250,
			})
			.toFormat("jpeg", { mozjpeg: true })
			.toBuffer();

		fs.writeFileSync(path.replace(".tmp", ""), resizedImage);

		const _user = await this.prisma.user.update({
			where: { id },
			data: { profileImage: filename.replace(".tmp", "") },
		});

		return {
			..._user,
			profileImage: _user.profileImage
				? `${getFilesLocation("profile-images")}/${_user.profileImage}`
				: null,
			password: undefined,
		};
	}

	async remove(id: number): Promise<User> {
		return await this.prisma.user.update({
			where: { id },
			data: { isActive: false },
		});
	}

	async massRemove(ids: string): Promise<any> {
		const _ids = ids.split(",").map(Number);

		const users = this.prisma.user.updateMany({
			where: {
				id: { in: _ids },
			},
			data: { isActive: false },
		});

		return users;
	}
}
