declare type PD<T> = {
    success: boolean;
    result: T
}

declare type UserDataPage = {
    userId: number;
    name: string;
    phone: string;
    address: string;
    description: string;
    role: string;
    profilePicture: null;
    email: string;
    isVerified: boolean;
    countSubscribedNodes: number;
    countManagedCompany: number;
}

declare type CompanyDataPage = {
    companyId: number;
    managedBy: number;
    name: string;
    description: string;
    address: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    coordinate: number[]
    manager: {
        name: string;
        userId: number;
        phone: string;
        profilePicture: string;
        email: string;
    };
}


declare type NodeDataPage = {
    nodeId: number;
    name: string;
    ownerId: number;
    description: string;
    address: string;
    coordinate: number[]
    status: string;
    instalationDate: string | null;
    apiKey: string;
    lastDataSent: string | null;
    createdAt: string;
    updatedAt: string;
    countUserSubscription: number;
    countCompanySubscribtion: number;
    owner: {
        userId: number
        name: string
        phone: string
        profilePicture: string | undefined
    }
}



declare type ReportsPerDay = {
    success: boolean;
    pagination: {
        previous: string;
        current: string;
        next: string;
    };
    result: ReportData[]
}

declare type ReportData = {
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