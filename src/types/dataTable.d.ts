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
	indoorNodeValue?: {
		name: string,
		data: {
			name: string,
			datetime: string,
			value: number
		}
	}[]
	indoorNodes?: {
		isUptodate: boolean;
		nodeId: number;
		companyId: number;
		name: string;
		status: string;
		lastDataSent: string;
		createdAt: string;
	}[]
	manager: {
		userId: number;
		name: string;
	};
}

declare type NodeData = {
	nodeId: number;
	companyId: number | null
	name: string;
	address : string;
	ownerId: number | undefined,
	coordinate: number[]
	isUptodate: boolean;
	lastDataSent: string | undefined;
	createdAt: string;
	isCompanyLocation?: boolean
	isSubscribed?: boolean,
	owner?: {
		name: string,
		companyId: number,
		type: string,
	}
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

declare type DTSubscribedCompanies = {
	companyId: number;
	name: string;
	type: string;
	joinedAt: string
	subscriptionId: number
}

declare type DTSubscribedNodes = {
	nodeId: number,
	name: string,
	coordinate: number[]
	isUptodate: boolean,
	lastDataSent: string,
	joinedAt: string
	subscriptionId: number
}

// result": [
//     {
//       "coordinate": [
//         -7.51510258,
//         110.08021656
//       ],
//       "nodeId": 54,
//       "name": "Node Indoor 1",
//       "status": "neversentdata",
//       "lastDataSent": null,
//       "companyId": 2,
//       "createdAt": "2024-06-03T12:47:52.000Z"
//     }

declare type DTPrivateNodes = {
	nodeId: number,
	name: string,
	coordinate: number[]
	isUptodate: boolean,
	lastDataSent: string,
	createdAt: string
}

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
	profilePicture: string | undefined;
	joinedAt: string;
	subscriptionId: number;
}



declare type searchUserWithSubsResult = {
	userId: number
	profilePicture: string
	name: string
	isInGroup: boolean
}

declare type searchGroupWithSubsResult = {
	nodeId: number
	name: string
	subscription?: string
}


declare type DTDatalog = {
	datetime: string;
	pm25: number;
	pm100: number;
	ch4: number;
	co2: number;
	temperature: number;
	humidity: number;
}



declare type DTEventLog = {
	eventLogId: number;
	companyId: number;
	name: string;
	type: string;
	startDate: string;
	status: string;
	endDate: string;
	duration: number
}

declare type DetailEventLog = {
	eventLogId: number;
	companyId: number;
	name: string;
	status: string;
	type: string;
	startDate: string;
	duration: number;
	endDate: string;
	description: string;
	location: string;
}

declare type CurrentEventLogs = {
	complete: {
		count: number;
		events: DTEventLog[];
	};
	inProgress: {
		count: number;
		events: DTEventLog[];
	};
	upcoming: {
		count: number;
		events: DTEventLog[];
	};
}


declare type DataPageData = {
	success: boolean;
	startDate: string;
	endDate: string;
	result: {
		nodeId: number;
		name: string;
		status: string;
		lastDataSent: string;
		dataLogs: DTDatalog[];
	};
}