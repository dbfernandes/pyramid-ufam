import { IsInt, IsString, IsOptional } from "class-validator";

export class CreateSubmissionActionDto {
	@IsInt()
	userId: number;

	@IsInt()
	submissionId: number;

	@IsInt()
	submissionActionTypeId: number;

	@IsOptional()
	@IsString()
	details?: string;
}
