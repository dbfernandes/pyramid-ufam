import ICourse from "./ICourse";

export default interface IUser {
	id: number;
	name: string;
	email: string;
	cpf?: string;
	enrollment?: string;
	courses: ICourse[];
	workloadCount?: any[];

	isActive: boolean;
}
