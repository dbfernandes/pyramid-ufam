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
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto";
import { SubmissionService } from "../submission/submission.service";
import { CreateActivityDto } from "../activity/dto";

@Controller("courses")
export class CourseController {
	constructor(
		private readonly courseService: CourseService,
		private readonly submissionService: SubmissionService,
	) {}

	@Get()
	findAll(
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
		},
	) {
		return this.courseService.findAll(query);
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.courseService.findById(+id);
	}

	@Get(":id/submissions")
	findSubmissionsByCourseId(
		@Param("id") id: string,
		@Query()
		query: {
			page: number;
			limit: number;
			search: string;
		},
	) {
		return this.submissionService.findAll({
			...query,
			courseId: +id,
		});
	}

	@Get(":id/:activityGroupName/activities")
	findActivitiesByCourseAndActivityGroup(
		@Param("id") id: string,
		@Param("activityGroupName") activityGroupName: string,
	) {
		return this.courseService.findActivitiesByCourseAndActivityGroup(
			+id,
			activityGroupName,
		);
	}

	@Post()
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	create(@Body() createCourseDto: CreateCourseDto) {
		return this.courseService.create(createCourseDto);
	}

	@Post(":id/:activityGroupName/activities")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	createActivityByCourseAndActivityGroup(
		@Param("id") id: string,
		@Param("activityGroupName") activityGroupName: string,
		@Body() createActivityDto: CreateActivityDto,
	) {
		return this.courseService.createActivityByCourseAndActivityGroup(
			+id,
			activityGroupName,
			createActivityDto,
		);
	}

	@Patch(":id")
	@UsePipes(
		new ValidationPipe({ transform: true, skipMissingProperties: false }),
	)
	update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
		return this.courseService.update(+id, updateCourseDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.courseService.remove(+id);
	}
}
