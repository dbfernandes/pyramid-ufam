import { Transform } from "class-transformer";
import {
	IsString,
	IsEmail,
	Validate,
	IsInt,
	IsNotEmpty,
	IsOptional,
	Allow,
} from "class-validator";
import { IsCPF } from "../../../../src/common/validators.validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsOptional()
	@Allow()
	@Validate(IsCPF)
	@Transform((value) => value.value.replace(/\D/g, ""))
	cpf?: string | null;

	@IsInt()
	@IsNotEmpty()
	userTypeId: number;

	@IsString()
	@IsNotEmpty()
	password?: string;
}
