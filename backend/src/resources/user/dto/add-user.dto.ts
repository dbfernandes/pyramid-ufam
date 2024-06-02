import { Transform } from "class-transformer";
import {
	IsString,
	IsEmail,
	Validate,
	IsNotEmpty,
	IsOptional,
	Allow,
	IsArray,
	IsInt,
} from "class-validator";
import { IsCPF, IsUserType } from "../../../../src/common/validators.validator";

export class AddUserDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	@Allow()
	@Validate(IsCPF)
	@Transform((value) => value.value.replace(/\D/g, ""))
	cpf: string;

	@IsNotEmpty()
	@IsString()
	@Validate(IsUserType)
	userType: string;

	@IsOptional()
	@IsInt()
	@Allow()
	courseId?: number;

	@IsOptional()
	@IsArray()
	@Allow()
	coursesIds?: number[];

	@IsOptional()
	@IsString()
	@Allow()
	enrollment?: string;

	@IsOptional()
	@IsInt()
	@Allow()
	@Transform((value) => parseInt(value.value, 10))
	startYear?: number;

	@IsOptional()
	@IsString()
	@Allow()
	password?: string;

	@IsOptional()
	@IsString()
	searchHash?: string;
}
