
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
	membersCount: number;
	memberRequestsCount: number;
	nodeCount: number;
	manager: {
		userId: number;
		name: string;
	}
}

declare type NodeData = {
	nodeId: number;
	name: string;
	longitude: number;
	latitude: number;
	status: string;
	environment: 'indoor' | 'outdoor';
	group: {
		groupId: number
		name: string,
	},
	lastDataSent: string | null,
}

declare type PaginationDataRes = {
	success: boolean;
	totalItems: number;
	currentPage: number;
	pageSize: number;
	result: any[]
}

declare type userOfGroupData = {
	userId: number;
	name: string;
	profilePicture: string;
	GroupPermissions: {
		permission: 'member' | 'manager';
		joinedAt: string;
		requestStatus: 'approved' | 'pending' | 'rejected';
		requestJoinAt: string,
	}
}
declare type groupOfUserData = {
	groupId: number
	name: string
	GroupPermissions: {
		permission: string,
		joinedAt: string
		requestStatus: string
		requestJoinAt:string
	}
}

declare type nodeOfGroupData = {
	nodeId: number,
	name: string,
	longitude: number,
	latitude: number,
	status: string,
	environment: 'indoor' | 'outdoor',
}


declare type detailOfGroupData = {
	groupId: number,
	name: string,
	description: string,
	address: string,
	createdAt: string,
	updatedAt: string,
	membersCount: number,
	nodeCount: number,
	memberRequestsCount: number,
	manager: {
		userId: number,
		name: string,
		phone: string,
		profilePicture: string,
		email: string,
	}
}




declare type searchUserWithSubsResult = {
	userId: number
	profilePicture: string
	name: string
	isInGroup: boolean
}

declare type searchGroupWithSubsResult = {
	groupId: number
	name: string
	status: 'approved' | 'pending' | 'rejected' | 'dismissed'
}




