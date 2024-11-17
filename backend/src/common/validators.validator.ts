import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { Statuses, UserTypes } from "./enums.enum";

@ValidatorConstraint({ name: "IsCNPJ", async: false })
export class IsCNPJ implements ValidatorConstraintInterface {
	validate(cnpj: string) {
		const numericCnpj = cnpj.replace(/\D/g, "");
		if (numericCnpj.length !== 14) {
			return false;
		}

		// Checksum
		const calculateChecksum = (slice) => {
			const length = slice.length;

			let checksum = 0;
			let pos = length - 7;

			for (let i = length; i >= 1; i--) {
				checksum += slice.charAt(length - i) * pos--;

				if (pos < 2) pos = 9;
			}

			return checksum % 11 < 2 ? 0 : 11 - (checksum % 11);
		};

		const firstDigit = calculateChecksum(numericCnpj.slice(0, 12));
		const secondDigit = calculateChecksum(numericCnpj.slice(0, 13));

		return (
			parseInt(numericCnpj.charAt(12)) === firstDigit &&
			parseInt(numericCnpj.charAt(13)) === secondDigit
		);
	}

	defaultMessage() {
		return "Invalid CNPJ";
	}
}

@ValidatorConstraint({ name: "IsCPF", async: false })
export class IsCPF implements ValidatorConstraintInterface {
	validate(cpf: string) {
		if (cpf.length == 0) return true;

		const knownInvalidCpfs = [
			"11111111111",
			"22222222222",
			"33333333333",
			"44444444444",
			"55555555555",
			"66666666666",
			"77777777777",
			"88888888888",
			"99999999999",
			"00000000000",
		];

		const numericCpf = cpf.replace(/\D/g, "");

		if (knownInvalidCpfs.includes(numericCpf) || numericCpf.length !== 11) {
			return false;
		}

		// Checksum
		const calculateChecksum = (slice) => {
			const length = slice.length;

			let checksum = 0;
			let pos = length + 1;

			for (let i = 0; i < length; i++) {
				checksum += slice.charAt(i) * pos--;

				if (pos < 2) pos = 9;
			}

			return checksum % 11 < 2 ? 0 : 11 - (checksum % 11);
		};

		const firstDigit = calculateChecksum(numericCpf.slice(0, 9));
		const secondDigit = calculateChecksum(numericCpf.slice(0, 10));

		return (
			parseInt(numericCpf.charAt(9)) === firstDigit &&
			parseInt(numericCpf.charAt(10)) === secondDigit
		);
	}

	defaultMessage() {
		return "Invalid CPF";
	}
}

@ValidatorConstraint({ name: "IsUserType", async: false })
export class IsUserType implements ValidatorConstraintInterface {
	validate(type: string) {
		return Object.values<string>(UserTypes).includes(type);
	}

	defaultMessage() {
		return "Invalid user type (must be either 'Coordenador', 'Secretário' or 'Aluno')";
	}
}

@ValidatorConstraint({ name: "IsStatus", async: false })
export class IsStatus implements ValidatorConstraintInterface {
	validate(type: string) {
		return Object.values<string>(Statuses).includes(type);
	}

	defaultMessage() {
		return "Invalid status (must be either 'Pendente', 'Pré-aprovado', 'Aprovado', 'Rejeitado')";
	}
}

@ValidatorConstraint({ name: "IsDescriptionActivityLengthValid", async: false })
export class IsDescriptionActivityLengthValid
	implements ValidatorConstraintInterface
{
	validate(description: string) {
		return typeof description === "string" && description.length <= 255;
	}

	defaultMessage() {
		return "A descrição deve ter no máximo 255 caracteres";
	}
}

@ValidatorConstraint({ name: "IsNameActivityLengthValid", async: false })
export class IsNameActivityLengthValid implements ValidatorConstraintInterface {
	validate(description: string) {
		return typeof description === "string" && description.length <= 255;
	}

	defaultMessage() {
		return "O nome deve ter no máximo 255 caracteres";
	}
}

@ValidatorConstraint({
	name: "IsDescriptionSubmissionLengthValid",
	async: false,
})
export class IsDescriptionSubmissionLengthValid
	implements ValidatorConstraintInterface
{
	validate(description: string) {
		return typeof description === "string" && description.length <= 100;
	}

	defaultMessage() {
		return "A descrição deve ter no máximo 100 caracteres";
	}
}
