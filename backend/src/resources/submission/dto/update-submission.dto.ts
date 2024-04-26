import { IsInt, IsString, IsOptional, IsBoolean } from "class-validator";

export class UpdateSubmissionDto {
	@IsOptional()
	@IsInt()
	userId?: number;

	@IsOptional()
	@IsInt()
	activityId?: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	file?: string;

	@IsOptional()
	@IsInt()
	workload?: number;

	@IsOptional()
	@IsInt()
	approvedWorkload?: number;

	@IsOptional()
	@IsString()
	details?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsString()
	searchHash?: string;
}
