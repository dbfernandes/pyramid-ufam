import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UsePipes,
	ValidationPipe,
	UseGuards,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto";
import { SubmissionService } from "../submission/submission.service";
import { CreateActivityDto } from "../activity/dto";
import { JwtAuthGuard } from "../../../src/guards/jwt-auth.guard";
import { Roles } from "../../../src/decorators/roles.decorator";
import { UserTypes } from "../../../src/common/enums.enum";
import { ExclusiveRolesGuard } from "../../../src/guards/exclusive-roles.guard";

@Controller("courses")
export class CourseController {
	constructor(
		private readonly courseService: CourseService,
		private readonly submissionService: SubmissionService,
	) {}

	@Get(":id/report")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY)
	async getCourseReport(@Param("id") id: string) {
		return await this.courseService.getCourseReport(+id);
	}

	@Get()
	async findAll(
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
		},
	) {
		return await this.courseService.findAll(query);
	}

	@Get(":id")
	async findById(@Param("id") id: string) {
		return await this.courseService.findById(+id);
	}

	@Get(":id/submissions")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR, UserTypes.SECRETARY)
	async findSubmissionsByCourseId(
		@Param("id") id: string,
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
			activityGroup: string;
			activity: number;
		},
	) {
		return await this.submissionService.findAll({
			...query,
			courseId: +id,
		});
	}

	@Get(":id/:activityGroupName/activities")
	async findActivitiesByCourseAndActivityGroup(
		@Param("id") id: string,
		@Param("activityGroupName") activityGroupName: string,
	) {
		return await this.courseService.findActivitiesByCourseAndActivityGroup(
			+id,
			activityGroupName,
		);
	}

	@Post()
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async create(@Body() createCourseDto: CreateCourseDto) {
		return await this.courseService.create(createCourseDto);
	}

	@Post(":id/:activityGroupName/activities")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async createActivityByCourseAndActivityGroup(
		@Param("id") id: string,
		@Param("activityGroupName") activityGroupName: string,
		@Body() createActivityDto: CreateActivityDto,
	) {
		return await this.courseService.createActivityByCourseAndActivityGroup(
			+id,
			activityGroupName,
			createActivityDto,
		);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	async update(
		@Param("id") id: string,
		@Body() updateCourseDto: UpdateCourseDto,
	) {
		return await this.courseService.update(+id, updateCourseDto);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard, ExclusiveRolesGuard)
	@Roles(UserTypes.COORDINATOR)
	async remove(@Param("id") id: string) {
		return await this.courseService.remove(+id);
	}
}
