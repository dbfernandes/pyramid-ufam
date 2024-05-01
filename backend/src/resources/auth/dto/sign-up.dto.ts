import { Transform } from "class-transformer";
import {
	IsString,
	IsEmail,
	Validate,
	IsNotEmpty,
	IsOptional,
	IsInt,
	Allow,
} from "class-validator";
import { IsCPF } from "../../../../src/common/validators.validator";

export class SignUpDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsOptional()
	@IsString()
	@Allow()
	@Validate(IsCPF)
	@Transform((value) => value.value.replace(/\D/g, ""))
	cpf: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsInt()
	@IsNotEmpty()
	courseId: number;

	@IsString()
	@IsNotEmpty()
	enrollment: string;

	@IsInt()
	@IsNotEmpty()
	@Transform((value) => parseInt(value.value, 10))
	startYear: number;

	@IsOptional()
	@IsString()
	searchHash: string;
}
