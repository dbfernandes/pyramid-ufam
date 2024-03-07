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
import { UserTypes } from "src/common/enums.enum";
import { CourseService } from "../course/course.service";
import { CourseUserService } from "../courseUser/courseUser.service";
import { UserTypeIds } from "src/common/constants.constants";
import { EnrollDto } from "./dto/enroll.dto";
import {
	decodeToken,
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
		private courseUserService: CourseUserService,

		@Inject(forwardRef(() => AuthService))
		private authService: AuthService,
	) {}

	async addUser(addUserDto: AddUserDto, token: string): Promise<any> {
		if (await this.findByEmail(addUserDto.email)) {
			console.log("Email already in use");
			throw new BadRequestException("Email already in use");
		}
		if (addUserDto.cpf && (await this.findByCpf(addUserDto.cpf))) {
			console.log("CPF already in use");
			throw new BadRequestException("CPF already in use");
		}
		if (
			addUserDto.courseId &&
			!(await this.courseService.findById(addUserDto.courseId))
		) {
			console.log("Course not found");
			throw new BadRequestException("Course not found");
		}
		if (addUserDto.coursesIds) {
			for (const _courseId of addUserDto.coursesIds) {
				if (!(await this.courseService.findById(_courseId))) {
					console.log(`Course (id: ${_courseId}) not found`);
					throw new BadRequestException(`Course (id: ${_courseId}) not found`);
				}
			}
		}
		if (
			addUserDto.enrollment &&
			(await this.courseUserService.findByEnrollment(addUserDto.enrollment))
		) {
			console.log("Enrollment already in use");
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

		// Setting password reset token and sending welcome email
		const resetToken = await this.authService.createPasswordResetToken(
			userCreated.email,
			48,
		);

		const userResponsible = await this.findById((decodeToken(token) as any).id);
		await this.sendWelcomeEmail(userResponsible, userCreated, resetToken); // Fix to get user who called the endpoint

		const courses = await this.courseService.findCoursesByUser(userCreated.id);

		return { user: { ...userCreated, courses } };
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

		await this.courseUserService.create({
			userId,
			courseId,
			enrollment: enrollment ? enrollment : null,
			startYear: startYear ? startYear : null,
		});

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

		await this.courseUserService.update(courseUser.id, {
			enrollment,
			startYear,
		});

		return await this.courseService.findCoursesByUser(user.id);
	}

	async unenroll(userId: number, courseId: number): Promise<any> {
		const user = await this.findById(userId);
		if (!user) throw new BadRequestException("User not found");
		const course = await this.courseService.findById(courseId);
		if (!course) throw new BadRequestException("Course not found");

		await this.courseUserService.unlinkUserFromCourse(userId, courseId);

		return await this.courseService.findCoursesByUser(user.id);
	}

	async findAll(query: any): Promise<any> {
		const { page, limit, search, type, courseId } = query;
		const skip = (page - 1) * limit;
		const where =
			search && search.trim() !== ""
				? {
						isActive: true,
						OR: [
							{ name: { contains: search } },
							{ email: { contains: search } },
						],
					}
				: { isActive: true };

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
				},
			}),
			this.prisma.user.count({
				where,
			}),
		]);

		const _users = users.map((user) => {
			const courses = user.CourseUsers.map((courseUser) => ({
				id: courseUser.Course.id,
				name: courseUser.Course.name,
				enrollment: courseUser.enrollment,
				startYear: courseUser.startYear,
			}));

			return {
				...user,
				courses,
				CourseUsers: undefined,
				password: undefined,
				userType: user.UserType,
				UserType: undefined,
			};
		});

		return {
			users: _users.filter((user) => user !== undefined && user !== null),
			total: totalUsers,
			totalPages: Math.ceil(totalUsers / limit),
			currentPage: parseInt(page),
		};
	}

	async findById(id: number): Promise<any | null> {
		return this.prisma.user.findUnique({ where: { id, isActive: true } });
	}

	// Used to verify availability
	async findByEmail(
		email: string,
		excludeId: number = 0,
	): Promise<User | null> {
		const user = this.prisma.user.findFirst({
			where: { email, id: { not: excludeId }, isActive: true },
			include: {
				UserType: { select: { id: true, name: true } },
			},
		});
		return user;
	}

	// Used to verify availability
	async findByCpf(cpf: string, excludeId: number = 0): Promise<User | null> {
		return this.prisma.user.findFirst({
			where: { cpf, id: { not: excludeId }, isActive: true },
		});
	}

	async findByResetToken(token: string): Promise<User | null> {
		return this.prisma.user.findFirst({
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

		return user;
	}

	async updateProfileImage(id: number, filename: string) {
		const rootPath = `./public/files/profile-images/`;
		const path = `${rootPath}${filename}`;

		const user = await this.findById(id);
		if (!user) {
			if (fs.existsSync(path)) {
				fs.unlinkSync(path);
			}
			throw new BadRequestException("User not found");
		}

		if (user && user.profileImage) {
			const currentImagePath = `${rootPath}${user.profileImage}`;

			if (fs.existsSync(currentImagePath)) {
				fs.unlinkSync(currentImagePath);
			}
		}

		const resizedImage = await sharp(path)
			.resize({
				fit: "cover",
				width: 250,
				height: 250,
			})
			.toFormat("jpeg", { mozjpeg: true })
			.toBuffer();

		fs.writeFileSync(path, resizedImage);

		return await this.prisma.user.update({
			where: { id },
			data: { profileImage: filename },
		});
	}

	remove(id: number): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
