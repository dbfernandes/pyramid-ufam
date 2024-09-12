import { Transform } from "class-transformer";
import {
	IsInt,
	IsString,
	IsOptional,
	IsNotEmpty,
	Validate,
} from "class-validator";
import { IsDescriptionSubmissionLengthValid } from "src/common/validators.validator";

export class UpdateSubmissionDto {
	@IsInt()
	@IsNotEmpty()
	@Transform((value) => parseInt(value.value))
	activityId: number;

	@IsString()
	@IsNotEmpty()
	@Validate(IsDescriptionSubmissionLengthValid)
	description: string;

	@IsInt()
	@IsNotEmpty()
	@Transform((value) => parseInt(value.value))
	workload: number;

	@IsString()
	@IsOptional()
	details?: string;
}
