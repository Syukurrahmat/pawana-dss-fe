declare type UserData = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | undefined | null ;
	email: string;
	createdAt: string;
}


declare type PaginationDataRes = {
	success: boolean;
	totalItems: number;
	currentPage: number;
	pageSize: number;
	result : any[]
}
declare type usersAPIData = {
	result: UserData[];
}  