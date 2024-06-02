import { Transform } from "class-transformer";
import { IsInt, IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateSubmissionDto {
	@IsInt()
	@IsNotEmpty()
	@Transform((value) => parseInt(value.value))
	activityId: number;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsInt()
	@IsNotEmpty()
	@Transform((value) => parseInt(value.value))
	workload: number;

	@IsString()
	@IsOptional()
	details?: string;
}
