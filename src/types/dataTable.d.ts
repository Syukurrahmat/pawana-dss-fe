declare type userRole = 'regular' | 'gov' | 'admin' | 'manager'


declare type UserData = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | undefined 
	email: string;
	createdAt: string;
	role: userRole
}

declare type CompanyData = {
	companyId: number;
	managedBy: number;
	name: string;
	address: string;
	type: string;
	createdAt: string;
	manager: {
		userId: number;
		name: string;
	};
}

declare type NodeData = {
	nodeId: number;
	name: string;
	ownerId: number | undefined,
	coordinate:number[]
	status: string;
	lastDataSent: string | undefined;
	createdAt: string;

	isCompanyLocation?: boolean
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


// ================

declare type DTNodeOf<T> = {
	nodeId: number,
	ownerId: number | undefined,
	name: string,
	coordinate:number[]
	status: string,
	lastDataSent: string,
} & T

declare type companySub = {
	CompanySubscriptions: {
		companySubscriptionId: number;
		createdAt: string;
	};
}

declare type userSub = {
	UsersSubscriptions: {
		usersSubscriptionId: number,
		createdAt: string,
	},
}

// ================


declare type DTUserManagedCompanies = {
	companyId: number;
	name: string;
	type: string;
	createdAt: string;
}


declare type DTNodeUsersSubscription = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: undefined;
	UsersSubscriptions: {
		usersSubscriptionId: number;
		createdAt: string;
	};
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




