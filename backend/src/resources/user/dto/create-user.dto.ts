import { Transform } from "class-transformer";
import {
	IsString,
	IsEmail,
	Validate,
	IsInt,
	IsNotEmpty,
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
	@Allow()
	@Validate(IsCPF)
	@Transform((value) => value.value.replace(/\D/g, ""))
	cpf: string;

	@IsInt()
	@IsNotEmpty()
	userTypeId: number;

	@IsString()
	@IsNotEmpty()
	password?: string;
}
