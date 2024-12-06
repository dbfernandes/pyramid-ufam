import { Transform } from "class-transformer";
import {
	IsString,
	IsEmail,
	IsBoolean,
	IsOptional,
	IsInt,
	IsDateString,
	Allow,
	Validate,
} from "class-validator";
import { IsCPF } from "src/common/validators.validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsString()
	@IsOptional()
	@Allow()
	@Validate(IsCPF)
	@Transform((value) => value.value.replace(/\D/g, ""))
	cpf?: string;

	@IsOptional()
	@IsInt()
	userTypeId?: number;

	@IsOptional()
	@IsString()
	profileImage?: string;

	@IsOptional()
	@IsString()
	password?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsString()
	resetToken?: string;

	@IsOptional()
	@IsDateString()
	resetTokenExpires?: Date;

	@IsOptional()
	@IsString()
	searchHash?: string;
}
