import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";

export class UpdateActivityDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsInt()
	maxWorkload?: number;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}
