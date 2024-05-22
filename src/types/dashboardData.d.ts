type Timeseries<V = number> = { datetime: string, value: V }

type ISPUValue = {
    pollutant: 'PM100' | 'PM25';
    ispu: number;
    ispuFloat: number;
    value: number;
    category: string;
}


type GRKCategorize = {
    gas: "CH4" | "CO2";
    value: number;
    category: string;
}

type NodeInfo = {
    name: string, nodeId: number
};


// ===========================================================

declare type ResultOfMappingNode = {
    meta: {
        isIndoor: boolean;
        dataIsUptodate: boolean;
    }
    node: {
        nodeId: number
        name: string
        coordinate: number[]
        status: string
        ownerId: number
        lastDataSent: Date
    }
    ispu: {
        datetime: Date;
        value: ISPUValue[];
    };
    ch4: {
        datetime: Date;
        value: GRKCategorize;
    };
    co2: {
        datetime: Date;
        value: GRKCategorize;
    };
    pm25: {
        datetime: Date;
        value: number;
    };
    pm100: {
        datetime: Date;
        value: number;
    };
}



// ==============================================================


type SingleNodeAnalysis = {
    ispu: SingleNodeAnalysisItem<ISPUValue[], ISPUValue[]>
    ch4: SingleNodeAnalysisItem<GRKCategorize, number>;
    co2: SingleNodeAnalysisItem<GRKCategorize, number>;
}

type SingleNodeAnalysisItem<V, W> = {
    node: NodeInfo
    current: {
        datetime: string;
        value: V;
    };
    tren: {
        datetime: string;
        value: W;
    }[];
}


//  ===============================


type ResultOfMultiNodeStats = {
    ispu: NodeStat<ISPUValue[]>;
    ch4: NodeStat<GRKCategorize>;
    co2: NodeStat<GRKCategorize>;
};

type NodeStat<T> = {
    highest: {
        node: NodeInfo;
        data: Timeseries<T>;
    };
    lowest: {
        node: NodeInfo;
        data: Timeseries<T>;
    };
    average: {
        data: Timeseries<T>;
    };
    list: {
        node: NodeInfo;
        data: Timeseries<T>;
    }[]
};


// ====================================================================

declare type DashboardDataType = {
    companyInfo: {
        companyId: number;
        managedBy: number;
        name: string;
        coordinate:number[]
        type: string;
        createdAt?: string;
        countNodes: number
    };
    indoor: DataNodeGroup;
    outdoor: DataNodeGroup;
    nodes: ResultOfMappingNode[]
}

type DataNodeGroup = {
    countNodes: {
        all: number;
        active: number;
        nonactive: number;
        noSendData: number;
    };
    data: DataNodes
}

type DetailCountNodes = {
    all: number;
    active: number;
    nonactive: number;
    noSendData: number;
}

type DataNodes = SingleNodeAnalysis | ResultOfMultiNodeStats;

interface ISPUDashboardData {
    data: DashboardDataType;
}