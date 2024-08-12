type UserDataPage = {
    userId: number;
    name: string;
    phone: string;
    address: string;
    description: string;
    role: string;
    profilePicture: string | undefined;
    email: string;
    isVerified: boolean;
    countSubscribedNodes: number;
    countManagedCompany: number;
}

type CompanyDataPage = {
    companyId: number;
    managedBy: number;
    name: string;
    description: string;
    address: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    coordinate: number[]
    countSubscribedNodes: number
    manager: {
        name: string;
        userId: number;
        phone: string;
        profilePicture: string;
        email: string;
    };
}


type NodeDataPage = {
    nodeId: number;
    companyId: number;
    name: string;
    isUptodate : boolean;
    ownerId: number;
    description: string;
    address: string;
    coordinate: number[]
    status: string;
    instalationDate: string | undefined;
    apiKey: string;
    lastDataSent: string | undefined;
    createdAt: string;
    updatedAt: string;
    environment: 'indoor' | 'outdoor'
    countUserSubscription: number;
    countCompanySubscribtion: number;
    dataLogs: DTDatalog[]
    owner: {
        userId: number
        name: string
        phone: string
        profilePicture: string | undefined
    }
}



type ReportsPerDay = {
    pagination: ReportsPagination;
    result: ReportData[]
}

type ReportsPagination = {
    previous: string;
    current: string;
    next: string;
}

type ReportData = {
    reportId: number;
    rating: number;
    message: string;
    coordinate: number[]
    images: string[];
    createdAt: string;
    updatedAt: string;
    creator: {
        userId: number,
        name: string,
        profilePicture: string,
    }
}


type CompaniesSummary = {
    all: number;
    type: SummaryItem[];
};

type UsersSummary = {
    all: number;
    role: SummaryItem[]
};

type NodesSummary = {
    all: number;
    ownership: SummaryItem[];
    status: SummaryItem[]
};

type SummaryItem = { value: string, count: number }

