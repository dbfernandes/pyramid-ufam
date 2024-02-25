import ICourse from "./ICourse";

export default interface IUserLogged {
	id: number;
	name: string;
	email: string;
	cpf?: string;
	userTypeId: number;
	profileImage: string;

	courses: ICourse[];
	selectedCourse: ICourse | null;

	logged: boolean;
	token: string;
	refreshToken: string;
}
