type Timeseries<V = number> = { datetime: string, value: V }

type ISPUValue = {
    pollutant: 'PM100' | 'PM25';
    ispu: number;
    ispuFloat: number;
    pollutantValue: number;
    category?: string;
    recomendation?: {
        info : string,
        company : string,
        public : string
    }
}


type GRKCategorize = {
    value: number;
    category?: string;
    recomendation?: {
        info : string,
        company : string,
        public : string
    }
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