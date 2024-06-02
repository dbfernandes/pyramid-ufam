import { Transform } from "class-transformer";
import { IsInt, IsString, IsOptional, IsNotEmpty } from "class-validator";

export class UpdateSubmissionDto {
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

	@IsInt()
	@IsNotEmpty()
	@Transform((value) => parseInt(value.value))
	userId?: number;

	@IsString()
	@IsOptional()
	details?: string;
}
