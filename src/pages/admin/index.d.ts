declare type usersData = {
	success: boolean;
	totalItems: number;
	currentPage: number;
	pageSize: number;
	result: {
		userId: number;
		name: string;
		phone: string;
		role: string;
		profilePicture: string | null;
		email: string;
		createdAt: string;
	}[];
};