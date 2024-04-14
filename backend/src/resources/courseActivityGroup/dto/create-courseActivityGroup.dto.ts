import { IsInt } from "class-validator";

export class CreateCourseActivityGroupDto {
	@IsInt()
	courseId: number;

	@IsInt()
	activityGroupId: number;

	@IsInt()
	maxWorkload: number;
}
