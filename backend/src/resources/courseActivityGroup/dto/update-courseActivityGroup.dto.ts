import { IsInt, IsOptional } from "class-validator";

export class UpdateCourseActivityGroupDto {
	@IsOptional()
	@IsInt()
	courseId?: number;

	@IsOptional()
	@IsInt()
	activityGroupId?: number;

	@IsOptional()
	@IsInt()
	maxWorkload?: number;
}
