import { IsString, IsBoolean, IsOptional } from "class-validator";

export class UpdateActivityGroupDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;
}
