
declare type UserData = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | undefined | null;
	email: string;
	createdAt: string;
}


declare type GroupData = {
	groupId: number;
	name: string;
	address: string;
	createdAt: string;
	memberCount: number;
	nodeCount: number;
	manager: {
		userId: number;
		name: string;
	}
}

declare type PaginationDataRes = {
	success: boolean;
	totalItems: number;
	currentPage: number;
	pageSize: number;
	result: any[]
}

declare type usersAPIData = {
	result: UserData[];
}


declare type userBelongToGroup = {
	userId: number;
	name: string;
	profilePicture: string;
	GroupPermissions: {
		permission: 'member' | 'manager';
		joinedAt: string;
		requestStatus: 'approved' | 'pending' | 'rejected';
	}
}

declare type nodeBelongToGroup = {
	nodeId: number,
	name: string,
	longitude: number,
	latitude: number,
	status: string,
	environment: 'indoor' | 'outdoor',
}

declare type nodeDataMap = {
	nodeId: number;
	name: string;
	longitude: number;
	latitude: number;
	status: string;
	environment: 'indoor' | 'outdoor';
};
