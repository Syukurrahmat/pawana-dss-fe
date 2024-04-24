declare type ispuDataType = {
    ispu: number;
    ispuFloat: number;
    value: number;
    category: string;
    color: string;
}

declare type aqDataType = {
    value: number;
    category: string;
}

declare type singleNodeDataType = {
    ispu: {
        datetime: string;
        currentISPU: {
            mainPollutant: string;
            ispu: number;
            ispuFloat: number;
            value: number;
            category: string;
            color: string;
        };
        allCurrentISPU: {
            pm25: ispuDataType
            pm100: ispuDataType
        };
        ISPUTren: {
            datetime: string;
            pm25: ispuDataType
            pm100: ispuDataType
        }[];
    };
    grk: {
        datetime: string;
        currentGRK: {
            ch4: aqDataType;
            co2: aqDataType;
        };
    };
    tempHum: {
        datetime: string;
        currentTempHum: {
            temp: aqDataType;
            hum: aqDataType;
        };
    };
    tren: {
        datetime: string;
        pm25: number;
        pm100: number;
        ch4: number;
        co2: number;
        temperature: number;
        humidity: number;
    }[];
};

declare type MultipleNodeDataType = {
    ispu: {
        ispuPerNode: {
            nodeId: number;
            name: string;
            ispu: {
                datetime: string;
                currentISPU: {
                    mainPollutant: string;
                    ispu: number;
                    ispuFloat: number;
                    value: number;
                    category: string;
                    color: string;
                };
                allCurrentISPU: {
                    pm25: ispuDataType;
                    pm100: ispuDataType;
                };
            };
        }[];
        average: {
            datetime: string;
            pm25: ispuDataType;
            pm100: ispuDataType;
        };
        highest: {
            nodeId: number;
            name: string;
            ispu: {
                datetime: string;
                currentISPU: {
                    mainPollutant: string;
                    ispu: number;
                    ispuFloat: number;
                    value: number;
                    category: string;
                    color: string;
                };
                allCurrentISPU: {
                    pm25: ispuDataType;
                    pm100: ispuDataType;
                };
            };
        },
        ispuPerNode: {
            nodeId: number;
            name: string;
            ispu: {
                datetime: string;
                currentISPU: {
                    mainPollutant: string;
                    ispu: number;
                    ispuFloat: number;
                    value: number;
                    category: string;
                    color: string;
                };
                allCurrentISPU: {
                    pm25: ispuDataType;
                    pm100: ispuDataType;
                };
            };
        }[],
        loweresr: {
            nodeId: number;
            name: string;
            ispu: {
                datetime: string;
                currentISPU: {
                    mainPollutant: string;
                    ispu: number;
                    ispuFloat: number;
                    value: number;
                    category: string;
                    color: string;
                };
                allCurrentISPU: {
                    pm25: ispuDataType;
                    pm100: ispuDataType;
                };
            };
        }
    },
    grk: {
        nodes: {
            name: string;
            nodeId: number;
            data: {
                datetime: string;
                pm25: number;
                pm100: number;
                ch4: number;
                co2: number;
                temperature: number;
                humidity: number;
            };
        }[];
        ch4: {
            average: aqDataType;
            highest: {
                nodeId: number;
                name: string;
                value: number;
                category: string;
            };
            lowerest: {
                nodeId: number;
                name: string;
                value: number;
                category: string;
            };
        };
        co2: {
            average: aqDataType;
            highest: {
                nodeId: number;
                name: string;
                value: number;
                category: string;
            };
            lowerest: {
                nodeId: number;
                name: string;
                value: number;
                category: string;
            };
        };
    },
    temHum: {
        temp: {
            average: aqDataType;
        };
        hum: {
            average: aqDataType;
        };
    }
}