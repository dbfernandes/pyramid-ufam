import {
	Controller,
	Post,
	Get,
	Body,
	Put,
	UsePipes,
	ValidationPipe,
	Res,
	Param,
	Headers,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResetPasswordDto } from "./dto";
import { LoginDto, SignUpDto } from "./dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("login")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async login(@Body() loginDto: LoginDto, @Res() res: Response) {
		return res.send(await this.authService.login(loginDto, res));
	}

	@Post("sign-up")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
		return res.send(await this.authService.signUp(signUpDto, res));
	}

	@Post("refresh-token")
	async refreshToken(
		@Headers("Refresh") refreshToken: string,
		@Res() res: Response,
	) {
		return res.send(await this.authService.refreshToken(refreshToken, res));
	}

	@Post("password-reset-request")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async requestPasswordReset(@Body("email") email: string) {
		const token = await this.authService.createPasswordResetToken(email);
		await this.authService.sendPasswordResetEmail(email, token);
		return { message: "Password reset email sent" };
	}

	@Get("password-reset/:token")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async findToken(@Param("token") token: string) {
		return await this.authService.findToken(token);
	}

	@Put("password-reset/:token")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async resetPassword(
		@Param("token") token: string,
		@Body() resetPasswordDto: ResetPasswordDto,
	) {
		await this.authService.resetPassword(token, resetPasswordDto.password);
		return { message: "Password reset successful" };
	}
}
