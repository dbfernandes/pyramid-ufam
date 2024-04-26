import {
	IsString,
	IsEmail,
	IsBoolean,
	IsOptional,
	IsInt,
	IsDateString,
} from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
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
