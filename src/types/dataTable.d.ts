
type DTSubscribedCompanies = {
	companyId: number;
	name: string;
	type: string;
	joinedAt: string
}

type DTSubscribedNodes = {
	nodeId: number,
	name: string,
	coordinate: number[]
	isUptodate: boolean,
	lastDataSent: string,
	joinedAt: string
}

type DTPrivateNodes = {
	nodeId: number,
	name: string,
	coordinate: number[]
	isUptodate: boolean,
	lastDataSent: string,
	createdAt: string
}
type DTUserManagedCompanies = {
	companyId: number;
	name: string;
	type: string;
	createdAt: string;
}



type DTNodeUsersSubscription = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | undefined;
	joinedAt: string;
}
type DTDatalog = {
	datetime: string;
	pm25: number;
	pm100: number;
	ch4: number;
	co2: number;
	temperature: number;
	humidity: number;
}



type DTEventLog = {
	eventLogId: number;
	companyId: number;
	name: string;
	type: string;
	startDate: string;
	status: string;
	endDate: string;
	duration: number
}

