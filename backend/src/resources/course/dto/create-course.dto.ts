import { Type } from "class-transformer";
import {
	IsString,
	IsInt,
	Length,
	Min,
	Max,
	IsNotEmpty,
	ValidateNested,
	IsOptional,
} from "class-validator";

class ActivityGroups {
	@IsInt()
	@IsNotEmpty()
	@Min(1)
	@Max(300)
	education: number;

	@IsInt()
	@IsNotEmpty()
	@Min(1)
	@Max(300)
	research: number;

	@IsInt()
	@IsNotEmpty()
	@Min(1)
	@Max(300)
	extension: number;
}

export class CreateCourseDto {
	@IsString()
	@IsNotEmpty()
	@Length(3, 100)
	name: string;

	@IsString()
	@IsNotEmpty()
	@Length(2, 10)
	code: string;

	@IsInt()
	@IsNotEmpty()
	@Min(1)
	@Max(16)
	periods: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(500)
	minWorkload: number;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ActivityGroups)
	activityGroupsWorkloads: ActivityGroups;
}
