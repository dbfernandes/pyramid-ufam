import {
	Body,
	Controller,
	Delete,
	Get,
	Headers,
	HttpStatus,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	ParseFilePipeBuilder,
	Patch,
	Post,
	Put,
	Query,
	UnprocessableEntityException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UserTypes } from "../../../src/common/enums.enum";
import { Roles } from "../../../src/decorators/roles.decorator";
import { ExclusiveRolesGuard } from "../../../src/guards/exclusive-roles.guard";
import { IsOwnerGuard } from "../../../src/guards/is-owner.guard";
import { JwtAuthGuard } from "../../../src/guards/jwt-auth.guard";
import { RolesGuard } from "../../../src/guards/roles.guard";
import { AuthService } from "../auth/auth.service";
import { CreateSubmissionDto } from "../submission/dto";
import { SubmissionService } from "../submission/submission.service";
import { AddUserDto, EnrollDto, UpdateUserDto } from "./dto";
import { UserService } from "./user.service";

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
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
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
			new ParseFilePipe({
				validators: [
					// Validador de tamanho máximo
					new MaxFileSizeValidator({
						maxSize:
							parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024,
						message: (size) =>
							`Arquivo muito grande. O tamanho máximo é de ${process.env.MAX_FILE_SIZE_MB}MB. O arquivo enviado tem ${(size / 1024 / 1024).toFixed(2)}MB.`,
					}),
				],
				errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			}),
		)
		file: Express.Multer.File,
	) {
		const allowedMimeType = "application/pdf";
		if (file.mimetype !== allowedMimeType) {
			// Lança uma exceção se o tipo não for o esperado.
			// O NestJS a converterá em uma resposta HTTP 422.
			throw new UnprocessableEntityException(
				`O tipo de arquivo é inválido. Apenas arquivos PDF são aceitos.`,
			);
		}

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
				.addMaxSizeValidator({
					maxSize: parseInt(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024,
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		file: Express.Multer.File,
	) {
		// --- VERIFICAÇÃO MANUAL DO TIPO DE ARQUIVO ---
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

		if (!allowedMimeTypes.includes(file.mimetype)) {
			// Lança uma exceção se o tipo de imagem não for o esperado
			throw new UnprocessableEntityException(
				"O tipo de arquivo é inválido. Apenas imagens PNG, JPEG ou JPG são aceitas.",
			);
		}
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
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
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
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
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
	async remove(
		@Param("id") id: string,
		@Headers("Authorization") token: string,
	) {
		return await this.userService.remove(+id, token);
	}

	@Delete(":ids/mass-remove")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async massRemove(
		@Param("ids") ids: string,
		@Headers("Authorization") token: string,
	) {
		return await this.userService.massRemove(ids, token);
	}

	@Patch(":id/restore")
	@UseGuards(JwtAuthGuard, RolesGuard, IsOwnerGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async restore(
		@Param("id") id: string,
		@Headers("Authorization") token: string,
	) {
		return await this.userService.restore(+id, token);
	}

	@Patch(":ids/mass-restore")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async massRestore(
		@Param("ids") ids: string,
		@Headers("Authorization") token: string,
	) {
		return await this.userService.massRestore(ids, token);
	}
}
