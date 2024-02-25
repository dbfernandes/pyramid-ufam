import { IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateCourseUserDto {
	@IsOptional()
	@IsString()
	enrollment: string;

	@IsOptional()
	@IsNumber()
	startYear: number;
}
