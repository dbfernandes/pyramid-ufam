import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	PreconditionFailedException,
	UnauthorizedException,
	forwardRef,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { SignUpDto } from "./dto/sign-up.dto";
import { UserTypes } from "../../../src/common/enums.enum";
import { UserTypeIds } from "../../../src/common/constants.constants";
import { LoginDto } from "./dto";
import { Response } from "express";
import { CourseService } from "../course/course.service";
import { CourseUserService } from "../courseUser/courseUser.service";
import { getFilesLocation, getFirstName, sendEmail } from "../utils";
import { UserTypeService } from "../userType/userType.service";

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private userService: UserService,

		private userTypeService: UserTypeService,
		private courseService: CourseService,
		private courseUserService: CourseUserService,
		private jwtService: JwtService,
	) {}

	async setAuthorizationHeader(user: any, res: Response) {
		const userType = await this.userTypeService.findById(user.userTypeId);
		const token = this.jwtService.sign(
			{
				email: user.email,
				id: user.id,
				userType: userType.name,
			},
			{ expiresIn: "30m" },
		);

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

		res.setHeader("X-Access-Token", token);
		res.setHeader("X-Refresh-Token", refreshToken);
	}

	async refreshToken(refreshToken: string, res: Response) {
		try {
			const decoded = this.jwtService.verify(refreshToken);
			if (!decoded.isRefreshToken) {
				throw new UnauthorizedException("Invalid refresh token");
			}

			const user = await this.userService.findByEmail(decoded.email);
			if (!user) {
				throw new UnauthorizedException("User not found");
			}

			await this.setAuthorizationHeader(user, res);
			return {
				message: "User reauthenticated successfully",
			};
		} catch (error) {
			throw new UnauthorizedException("Invalid refresh token");
		}
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new UnauthorizedException("Invalid email");
		}

		if (!user.isActive) {
			throw new PreconditionFailedException("User deactivated");
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
		await this.setAuthorizationHeader(user, res);

		return {
			user: {
				...user,
				courses,
				profileImage: user.profileImage
					? `${getFilesLocation("profile-images")}/${user.profileImage}`
					: null,
				password: undefined,
			},
		};
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

		// Generate searchHash
		const searchHash = `${user.id};${user.name};${user.email};${user.cpf}`;

		// Update user with searchHash
		const updatedUser = await this.userService.update(user.id, { searchHash });

		// Registering course
		await this.courseUserService
			.create({
				courseId,
				enrollment,
				startYear,
				userId: user.id,
			})
			.then(() => this.userService.updateSearchHash(user.id));

		const courses = await this.courseService.findCoursesByUser(updatedUser.id);

		// Generating tokens
		await this.setAuthorizationHeader(updatedUser, res);

		// Sending welcome email
		this.sendWelcomeEmail(updatedUser);

		return {
			user: {
				...updatedUser,
				courses,
				profileImage: updatedUser.profileImage
					? `${getFilesLocation("profile-images")}/${updatedUser.profileImage}`
					: null,
				password: undefined,
			},
		};
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

	async findToken(token: string): Promise<any> {
		const user = await this.userService.findByResetToken(token);
		if (!user || new Date() > user.resetTokenExpires)
			throw new NotFoundException("Invalid or expired token");

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			resetToken: user.resetToken,
			resetTokenExpires: user.resetTokenExpires,
		};
	}

	async sendPasswordResetEmail(email: string, token: string) {
		await sendEmail(
			email,
			"Alteração de senha",
			`Você ou algum coordenador solicitou alteração de senha para a sua conta. Para alterar sua senha no Pyramid, clique no link a seguir: ${`${process.env.FRONTEND_URL}/conta/senha?token=${token}`}.
      O token expira em 1 hora.
      
      Caso não tenha sido você, desconsidere este email.
      `,
		);
	}

	async resetPassword(token: string, password: string): Promise<void> {
		const user = await this.userService.findByResetToken(token);
		if (!user || new Date() > user.resetTokenExpires)
			throw new BadRequestException("Invalid or expired token");

		const hashedPassword = bcrypt.hashSync(password, 10);
		await this.userService.update(user.id, {
			password: hashedPassword,
			resetToken: null,
			resetTokenExpires: null,
		});
	}
}
