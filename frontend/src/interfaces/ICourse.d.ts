export default interface ICourse {
	id: number;
	enrollment?: string;
	name: string;
	code: string;
	periods: number;
	isActive: boolean;
	userCount?: number;
}
