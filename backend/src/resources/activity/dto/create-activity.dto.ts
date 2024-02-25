import { IsString, IsInt, IsOptional, IsNotEmpty } from "class-validator";

export class CreateActivityDto {
	@IsOptional()
	@IsInt()
	courseActivityGroupId: number;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsNotEmpty()
	@IsInt()
	maxWorkload: number;
}
