type Timeseries<V = number> = { datetime: string, value: V }

type ISPUValue = {
    pollutant: 'PM100' | 'PM25';
    ispu: number;
    ispuFloat: number;
    pollutantValue: number;
    category: string;
    recomendation?: string
}


type GRKCategorize = {
    gas: "CH4" | "CO2";
    value: number;
    category: string;
    recomendation?: string
}

// ===========================================================

declare type ResultOfMappingNode = {
    nodeId: number;
    companyId: any;
    name: string;
    status: string;
    lastDataSent: string
    coordinate: number[];
    dataLogs?: DataLogs[],


    latestData?: {
        ispu: {
            datetime: string;
            value: [] | [ISPUValue, ISPUValue];
        };
        ch4: {
            datetime: string;
            value: GRKCategorize;
        };
        co2: {
            datetime: string;
            value: GRKCategorize;
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

    ispu: SingleNodeAnalysisItem<ISPUValue[]>
    ch4: SingleNodeAnalysisItem<GRKCategorize>;
    co2: SingleNodeAnalysisItem<GRKCategorize>;

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
    ispu: NodeStat<ISPUValue[]>;
    ch4: NodeStat<GRKCategorize>;
    co2: NodeStat<GRKCategorize>;
};

type NodeStat<T> = {
    average: {
        data: {
            datetime: string;
            value: T
        }
    };
    highest: {
        nodeId: number;
        name: string;
        lastDataSent: string;
        data: {
            datetime: string;
            value: T
        }
    };
    lowest: {
        nodeId: number;
        name: string;
        lastDataSent: string;
        data: {
            datetime: string;
            value: T
        }
    };

    list: {
        nodeId: number;
        name: string;
        lastDataSent: string;
        data: {
            datetime: string;
            value: T
        }
    }[]
};


// ====================================================================

declare type DashboardDataType = {
    dashboardInfo: {
        name: string;
        type: string;
        countNodes: number

        companyId?: number;
        managedBy?: number;
        createdAt?: string;
    };
    indoor: {
        countNodes: DetailCountNodes;
        data: SingleNodeAnalysis | ResultOfMultiNodeStats | null;
    };
    outdoor: {
        countNodes: DetailCountNodes;
        data: SingleNodeAnalysis | ResultOfMultiNodeStats | null;
    };
    nodes: ResultOfMappingNode[];
    currentEventLogs: EventLogs[];
    nearReports: Reports[]
}

type DetailCountNodes = {
    all: number;
    active: number;
}

type DataNodeGroup = {
    countNodes: DetailCountNodes;
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