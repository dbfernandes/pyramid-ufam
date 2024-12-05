import ICourse from "./ICourse";

export default interface IUser {
	userTypeId: number;
	profileImage: string;
	selectedCourse: null;
	logged: boolean;
	token: string;
	refreshToken: string;
	id: number;
	name: string;
	email: string;
	cpf: string;
	enrollment?: string;
	courses: ICourse[];

	isActive: boolean;
}
