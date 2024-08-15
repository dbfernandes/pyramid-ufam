import { Transform } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Validate,
} from "class-validator";
import { IsStatus } from "../../../../src/common/validators.validator";

export class UpdateStatusDto {
	@IsString()
	@IsNotEmpty()
	@Validate(IsStatus)
	status: string;

	@IsString()
	@IsOptional()
	details?: string;
}
