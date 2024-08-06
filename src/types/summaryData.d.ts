
type ISPUValue = {
    pollutant: 'PM100' | 'PM25';
    ispu: number;
    ispuFloat: number;
    pollutantValue: number;
    category: string;
    recomendation?: string
}


type GRKCategorize = {
    value: number;
    category: string;
    recomendation?: string
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

declare type DTEventLog = {
    eventLogId: number;
    companyId: number;
    name: string;
    type: string;
    startDate: string;
    status: string;
    endDate: string;
}


declare type CompanyDataSummary = {
    name: string,
    coordinate: number[],
    type: string,
    companyId: number

}




type SummaryDataAverage = {
    ispu: [ISPUValue, ISPUValue];
    co2: GRKCategorize;
    ch4: GRKCategorize;
    pm25: number;
    pm100: number;
}

type SummaryDataTren = {
    datetime: string;
    indoor?: SummaryDataAverage,
    outdoor?: SummaryDataAverage
}

type SummaryReport = {
    average: number;
    count: number;
    countPerStar: number[];
    reports: ReportData[]
}

type SummaryEventLog = {
    count: {
        all: number;
        countStatus: {
            status: string;
            count: number;
        }[];
        countType: {
            type: string;
            count: number;
            days : number
        }[];
    };
    eventIdLongestEvent: number | undefined;
    eventLogs: DTEventLog[];
}

type SummaryData = {
    meta: {
        company: CompanyDataSummary,
        startDate: string;
        endDate: string;
    },
    averageData: {
        indoor?: SummaryDataAverage;
        outdoor?: SummaryDataAverage;
    };
    tren: SummaryDataTren[];
    reports: SummaryReport;
    eventLogs: SummaryEventLog;
}