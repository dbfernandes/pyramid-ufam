import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	forwardRef,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { SignUpDto } from "./dto/sign-up.dto";
import { UserTypes } from "src/common/enums.enum";
import { UserTypeIds } from "src/common/constants.constants";
import { LoginDto } from "./dto";
import { Response } from "express";
import { CourseService } from "../course/course.service";
import { CourseUserService } from "../courseUser/courseUser.service";
import { getFirstName, sendEmail } from "../utils";

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private userService: UserService,

		private courseService: CourseService,
		private courseUserService: CourseUserService,
		private jwtService: JwtService,
	) {}

	async setAuthorizationHeader(user: any, res: Response) {
		const userType = user.userType ? user.userType : user.UserType;
		const token = this.jwtService.sign({
			email: user.email,
			id: user.id,
			userType: userType.name,
		});

		const refreshToken = this.jwtService.sign(
			{
				email: user.email,
				id: user.id,
				userType: userType.name,
				isRefreshToken: true,
			},
			{
				expiresIn: "7d",
			},
		);

		res.setHeader("X-Access-Token", `Bearer ${token}`);
		res.setHeader("X-Refresh-Token", refreshToken);
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new UnauthorizedException("Invalid email");
		}

		if (
			user &&
			user.password != null &&
			bcrypt.compareSync(password, user.password)
		) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}
		throw new UnauthorizedException("Invalid password");
	}

	async login(loginDto: LoginDto, res: Response) {
		const user = await this.validateUser(loginDto.email, loginDto.password);
		const courses = await this.courseService.findCoursesByUser(user.id);

		// Generating tokens
		this.setAuthorizationHeader(user, res);

		return res.json({ user: { ...user, courses } });
	}

	async signUp(signUpDto: SignUpDto, res: Response) {
		if (await this.userService.findByEmail(signUpDto.email)) {
			throw new BadRequestException("Email already in use");
		}
		if (signUpDto.cpf && (await this.userService.findByCpf(signUpDto.cpf))) {
			throw new BadRequestException("CPF already in use");
		}
		if (!(await this.courseService.findById(signUpDto.courseId))) {
			throw new BadRequestException("Course not found");
		}
		if (await this.courseUserService.findByEnrollment(signUpDto.enrollment)) {
			throw new BadRequestException("Enrollment already in use");
		}

		const { courseId, enrollment, startYear, ..._signUpDto } = signUpDto;

		// Registering user
		const hashedPassword = bcrypt.hashSync(_signUpDto.password, 10);

		const user = await this.userService.create({
			..._signUpDto,
			cpf: signUpDto.cpf ? signUpDto.cpf.replace(/\D/g, "") : null,
			password: hashedPassword,
			userTypeId: UserTypeIds[UserTypes.STUDENT], // Sign up can only be done by students
		});

		// Registering course
		await this.courseUserService.create({
			courseId,
			enrollment,
			startYear,
			userId: user.id,
		});

		const courses = await this.courseService.findCoursesByUser(user.id);

		// Generating tokens
		this.setAuthorizationHeader(user, res);

		// Sending welcome email
		this.sendWelcomeEmail(user);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...result } = user;

		return res.json({ user: { ...result, courses } });
	}

	async batchSignUp(/*signUpDtos: SignUpDto[]*/) {
		const users = [];
		const errors = [];

		/*for (const signUpDto of signUpDtos) {
			Adicionar usuário
		} */

		return { errors: errors, users: users };
	}

	async createPasswordResetToken(
		email: string,
		expireHours: number = 1,
	): Promise<string> {
		const user = await this.userService.findByEmail(email);
		if (!user) throw new NotFoundException("Email not found");

		const resetToken = uuid.v4();
		const resetTokenExpires = new Date();
		resetTokenExpires.setHours(resetTokenExpires.getHours() + expireHours); // Token expires in 1 hour by default

		// Save resetToken and resetTokenExpires in user record
		await this.userService.update(user.id, {
			resetToken,
			resetTokenExpires,
		});

		return resetToken;
	}

	async sendWelcomeEmail(user: any) {
		await sendEmail(
			user.email,
			"Bem vindo ao Pyramid!",
			`Olá, ${getFirstName(
				user.name,
			)}! Você foi cadastrado com sucesso no Pyramid, uma plataforma do ICOMP para gerenciar suas atividades extracurriculares.
      Para acessar a plataforma, clique no link a seguir: ${
				process.env.FRONTEND_URL
			}`,
		);
	}

	async sendPasswordResetEmail(email: string, token: string) {
		await sendEmail(
			email,
			"Password Reset",
			`Use this token to reset your password: ${token}`,
		);
	}

	async resetPassword(token: string, newPassword: string): Promise<void> {
		const user = await this.userService.findByResetToken(token);
		if (!user || new Date() > user.resetTokenExpires)
			throw new BadRequestException("Invalid or expired token");

		const hashedPassword = bcrypt.hashSync(newPassword, 10);
		await this.userService.update(user.id, {
			password: hashedPassword,
			resetToken: null,
			resetTokenExpires: null,
		});
	}
}
