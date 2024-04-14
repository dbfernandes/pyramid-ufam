import { Transform } from "class-transformer";
import { IsString, IsOptional, Allow, IsInt } from "class-validator";

export class EnrollDto {
	@IsOptional()
	@IsString()
	@Allow()
	enrollment: string;

	@IsOptional()
	@IsInt()
	@Allow()
	@Transform((value) => parseInt(value.value, 10))
	startYear: number;
}
