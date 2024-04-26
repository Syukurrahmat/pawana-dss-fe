declare type userData = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | null;
	email: string;
	createdAt: string;
}

declare type usersAPIData = {
	success: boolean;
	totalItems: number;
	currentPage: number;
	pageSize: number;
	result: userData[];
};