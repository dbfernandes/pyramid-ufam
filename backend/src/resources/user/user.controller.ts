import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
	UseInterceptors,
	UploadedFile,
	UsePipes,
	ValidationPipe,
	Put,
	Headers,
	ParseFilePipeBuilder,
	HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { SubmissionService } from "../submission/submission.service";
import { AddUserDto, UpdateUserDto, EnrollDto } from "./dto";
import { JwtAuthGuard } from "../../../src/guards/jwt-auth.guard";
import { CreateSubmissionDto } from "../submission/dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { IsOwnerGuard } from "../../../src/guards/is-owner.guard";
import { RolesGuard } from "../../../src/guards/roles.guard";
import { Roles } from "../../../src/decorators/roles.decorator";
import { UserTypes } from "../../../src/common/enums.enum";
import { ExclusiveRolesGuard } from "../../../src/guards/exclusive-roles.guard";
import { AuthService } from "../auth/auth.service";

@Controller("users")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private readonly submissionService: SubmissionService,
	) {}

	@Get()
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY, UserTypes.STUDENT)
	async findAll(
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
			type: string;
			courseId: number;
			active: boolean;
		},
	) {
		return await this.userService.findAll(query);
	}

	@Get(":id/report/:courseId")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY, UserTypes.STUDENT)
	async getUserReport(
		@Param("id") id: string,
		@Param("courseId") courseId: string,
	) {
		return await this.userService.getUserReport(+id, +courseId);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY, UserTypes.STUDENT)
	async findById(@Param("id") id: string) {
		return await this.userService.findById(+id);
	}

	@Get(":id/submissions")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY, UserTypes.STUDENT)
	async findSubmissionsByUserId(
		@Param("id") id: string,
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
			courseId: number;
		},
	) {
		return await this.submissionService.findAll({
			...query,
			userId: +id,
		});
	}

	@Post()
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async addUser(
		@Body() addUserDto: AddUserDto,
		@Headers("Authorization") token: string,
	) {
		return await this.userService.addUser(addUserDto, token);
	}

	@Post(":id/enroll/:courseId")
	@UseGuards(JwtAuthGuard, IsOwnerGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async enroll(
		@Param("id") id: string,
		@Param("courseId") courseId: string,
		@Body() enrollDto: EnrollDto,
	) {
		return await this.userService.enroll(+id, +courseId, enrollDto);
	}

	@Post(":id/submit")
	@UseGuards(JwtAuthGuard, IsOwnerGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./public/files/tmp",
				filename: (req, file, cb) =>
					cb(null, `${new Date().getTime()}-${file.originalname}.tmp`),
			}),
		}),
	)
	async submit(
		@Param("id") id: string,
		@Body() createSubmissionDto: CreateSubmissionDto,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: "pdf",
				})
				.addMaxSizeValidator({
					maxSize: 5000 * 1024,
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		file: Express.Multer.File,
	) {
		return await this.submissionService.submit(
			+id,
			createSubmissionDto,
			file.filename,
		);
	}

	@UseGuards(JwtAuthGuard, IsOwnerGuard)
	@Put(":id/image")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: `./public/files/tmp`,
				filename: (req, file, cb) =>
					cb(
						null,
						`${req.params.id}-${new Date().getTime()}-${file.originalname}.tmp`,
					),
			}),
		}),
	)
	async updateProfileImage(
		@Param("id") id: string,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: ".(png|jpeg|jpg)",
				})
				.addMaxSizeValidator({
					maxSize: 1000 * 1024,
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		file: Express.Multer.File,
	) {
		return await this.userService.updateProfileImage(+id, file.filename);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return await this.userService.update(+id, updateUserDto);
	}

	@Patch(":id/enroll/:courseId")
	@UseGuards(JwtAuthGuard, IsOwnerGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async updateEnrollment(
		@Param("id") id: string,
		@Param("courseId") courseId: string,
		@Body() enrollDto: EnrollDto,
	) {
		return await this.userService.updateEnrollment(+id, +courseId, enrollDto);
	}

	@Delete(":id/unenroll/:courseId")
	@UseGuards(JwtAuthGuard, IsOwnerGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async unenroll(@Param("id") id: string, @Param("courseId") courseId: string) {
		return await this.userService.unenroll(+id, +courseId);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async remove(@Param("id") id: string) {
		return await this.userService.remove(+id);
	}

	@Delete(":ids/mass-remove")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async massRemove(@Param("ids") ids: string) {
		return await this.userService.massRemove(ids);
	}
}
