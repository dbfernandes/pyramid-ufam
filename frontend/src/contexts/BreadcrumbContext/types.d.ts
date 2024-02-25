export interface ILink {
	title: string;
	route?: string;
}

export interface IBreadcrumbContext {
	links: ILink[];
	setLinks: React.Dispatch<React.SetStateAction<ILink[]>>;
}

export interface IBreadcrumbContextProvider {
	children: React.ReactNode;
}
