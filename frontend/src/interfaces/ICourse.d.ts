interface ActivityGroup {
	totalWorkload: number;
}

interface WorkloadCount {
	Ensino: ActivityGroup;
	Extensão: ActivityGroup;
	Pesquisa: ActivityGroup;
	totalWorkload: number;
}

export default interface ICourse {
	id: number;
	enrollment?: string;
	name: string;
	code: string;
	periods: number;
	isActive: boolean;
	userCount?: number;
	minWorkload?: number;

	workloadCount?: WorkloadCount;
}
