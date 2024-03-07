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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { SubmissionService } from "../submission/submission.service";
import { AddUserDto, UpdateUserDto, EnrollDto } from "./dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { OwnUserGuard } from "src/guards/own-user.guard";
import { CreateSubmissionDto } from "../submission/dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller("users")
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly submissionService: SubmissionService,
	) {}

	@Get()
	findAll(
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
			type: string;
			courseId: number;
		},
	) {
		return this.userService.findAll(query);
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.userService.findById(+id);
	}

	@Get(":id/submissions")
	findSubmissionsByUserId(
		@Param("id") id: string,
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
			courseId: number;
		},
	) {
		return this.submissionService.findAll({
			...query,
			userId: +id,
		});
	}

	@Post()
	// @UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	addUser(
		@Body() addUserDto: AddUserDto,
		@Headers("Authorization") token: string,
	) {
		return this.userService.addUser(addUserDto, token);
	}

	@Post(":id/enroll/:courseId")
	// @UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	enroll(
		@Param("id") id: string,
		@Param("courseId") courseId: string,
		@Body() enrollDto: EnrollDto,
	) {
		return this.userService.enroll(+id, +courseId, enrollDto);
	}

	@Post(":id/submit")
	// @UseGuards(JwtAuthGuard, OwnUserGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./public/files/submissions",
				filename: (req, file, cb) =>
					cb(null, `${new Date().getTime()}-${file.originalname}`),
			}),
		}),
	)
	submit(
		@Param("id") id: string,
		@Body() createSubmissionDto: CreateSubmissionDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.submissionService.submit(
			+id,
			createSubmissionDto,
			file.filename,
		);
	}

	@Put(":id/image")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: `./public/files/profile-images`,
				filename: (req, file, cb) =>
					cb(
						null,
						`${req.params.id}-${new Date().getTime()}-${file.originalname}`,
					),
			}),
		}),
	)
	updateProfileImage(
		@Param("id") id: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.userService.updateProfileImage(+id, file.filename);
	}

	@Patch(":id")
	// @UseGuards(JwtAuthGuard, OwnUserGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Patch(":id/enroll/:courseId")
	// @UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	updateEnrollment(
		@Param("id") id: string,
		@Param("courseId") courseId: string,
		@Body() enrollDto: EnrollDto,
	) {
		return this.userService.updateEnrollment(+id, +courseId, enrollDto);
	}

	@Delete(":id/unenroll/:courseId")
	// @UseGuards(JwtAuthGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	unenroll(@Param("id") id: string, @Param("courseId") courseId: string) {
		return this.userService.unenroll(+id, +courseId);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, OwnUserGuard)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	remove(@Param("id") id: string) {
		return this.userService.remove(+id);
	}
}
