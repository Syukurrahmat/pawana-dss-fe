type UserRole = 'regular' | 'gov' | 'admin' | 'manager'

type UserData = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | undefined
	email: string;
	createdAt: string;
	role: userRole
}

type CompanyData = {
	companyId: number;
	managedBy: number;
	name: string;
	coordinate: number[],
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

type NodeData = {
	nodeId: number;
	companyId: number | null
	name: string;
	address: string;
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


type userOfGroupData = {
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



type companySub = {
	CompanySubscriptions: {
		companySubscriptionId: number;
		createdAt: string;
	};
}

type userSub = {
	UsersSubscriptions: {
		usersSubscriptionId: number,
		createdAt: string,
	},
}

// ================



type searchUserWithSubsResult = {
	userId: number
	profilePicture: string
	name: string
	isInGroup: boolean
}

type searchGroupWithSubsResult = {
	nodeId: number
	name: string
	subscription?: string
}


type DetailEventLog = {
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

type CurrentEventLogs = {
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

// type DataPageData = {
// 	success: boolean;
// 	startDate: string;
// 	endDate: string;
// 	result: {
// 		nodeId: number;
// 		name: string;
// 		status: string;
// 		lastDataSent: string;
// 		dataLogs: DTDatalog[];
// 	};
// }


type DownloadDataResponse = {
	startDate: string;
	endDate: string;
	result: any;
};
