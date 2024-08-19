type Timeseries<V = number> = { datetime: string, value: V }



type ISPUValue = [ISPUValueItem, ISPUValueItem] | null

type GRKValue = {
    value: number;
    category?: string;
    recomendation?: Recomendation
}

type Recomendation = {
    info: string;
    company: string;
    public: string;
}


type ISPUValueItem = {
    pollutant: 'PM100' | 'PM25';
    ispu: number;
    ispuFloat: number;
    pollutantValue: number;
    category?: string;
    recomendation?: Recomendation
}


// ===========================================================

declare type NodeWLastestData = {
    nodeId: number;
    companyId: any;
    name: string;
    status: string;
    lastDataSent: string
    coordinate: number[];

    latestData?: {
        ispu: {
            datetime: string;
            value: ISPUValue;
        };
        ch4: {
            datetime: string;
            value: GRKValue;
        };
        co2: {
            datetime: string;
            value: GRKValue;
        };
        pm25: {
            datetime: string;
            value: number;
        };
        pm100: {
            datetime: string;
            value: number;
        };
    }

}



// ==============================================================


type SingleNodeAnalysis = {
    node: {
        name: string,
        nodeId: number,
        lastDataSent: string;
    }

    ispu: SingleNodeAnalysisItem<ISPUValue>
    ch4: SingleNodeAnalysisItem<GRKValue>;
    co2: SingleNodeAnalysisItem<GRKValue>;

}

type SingleNodeAnalysisItem<V> = {
    latestData: {
        datetime: string;
        value: V;
    }
    tren: {
        datetime: string;
        value: V;
    }[];
}


//  ===============================


type ResultOfMultiNodeStats = {
    ispu: NodeStat<ISPUValue>;
    ch4: NodeStat<GRKValue>;
    co2: NodeStat<GRKValue>;
};

type NodeStat<T> = {
    average: {
        data: Timeseries<T>
    };
    highest: {
        nodeId: number;
        name: string;
        lastDataSent: string;
        data: Timeseries<T>
    };
    lowest: {
        nodeId: number;
        name: string;
        lastDataSent: string;
        data: Timeseries<T>
    };
};


// ====================================================================

declare type DashboardDataType = {
    dashboardInfo: {
        name: string;
        type: string;
        countNodes: number
        coordinate: number[]
        companyId?: number;
        userId?: number;
        managedBy?: number;
        createdAt?: string;
    };
    indoor?: NodesGroup;
    outdoor: NodesGroup;
    nodes: {
        indoor?: NodeWLastestData[],
        outdoor: NodeWLastestData[]
    };
    currentEventLogs: EventLogs[];
    nearReports: Reports[]
}

type NodesGroup = {
    analiysisDataType: string;
    countNodes: {
        all: number;
        active: number;
    };
    data: SingleNodeAnalysis | ResultOfMultiNodeStats | null;
}

type EventLogs = {
    eventLogId: number;
    companyId: number;
    name: string;
    type: string;
    isCompleted: boolean;
    startDate: string;
    endDate: string;
}


// ===================================================================
// ===================================================================

type TrenItem = {
    datetime: string;
    indoor?: SummaryAverageInsight
    outdoor?: SummaryAverageInsight
};

type SummaryAverageInsight = {
    ispu: ISPUValue;
    co2: GRKValue;
    ch4: GRKValue;
    pm25: number;
    pm100: number;
}

type SummaryData = {
    meta: {
        company: Companies,
        startDate: string;
        endDate: string;
    },
    averageData: {
        indoor?: SummaryAverageInsight;
        outdoor?: SummaryAverageInsight;
    };
    tren: TrenItem[];
    reports: ReportSummary;
    eventLogs: EventLogsSummary
}

type ReportSummary = {
    average: number;
    count: number;
    countPerStar: number[];
    reports: Reports[];
}


type EventLogsSummary = {
    count: {
        all: number;
        countStatus: {
            status: string;
            count: number;
        }[];
        countType: {
            type: string;
            count: number;
            days: number
        }[];
    };
    eventIdLongestEvent: number | undefined;
    eventLogs: DTEventLog[];
}
