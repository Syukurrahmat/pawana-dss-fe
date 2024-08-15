export interface AirParamList {
	name: string;
	type: 'bar' | 'line';
	dataKeyTypeAndFunc: (envType: keyof Omit<TrenItem, 'datetime'>) => {
		envType: keyof Omit<TrenItem, 'datetime'>;
		func: (e: TrenItem) => any;
	};
}

export const airQualityTrenList: AirParamList[] = [
	{
		type: 'bar',
		name: 'ISPU',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ispu?.[0],
			envType,
		}),
	},
	{
		type: 'bar',
		name: 'ISPU PM2.5',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ispu?.find((f) => f.pollutant == 'PM25'),
			envType,
		}),
	},
	{
		type: 'bar',
		name: 'ISPU PM10',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ispu?.find((f) => f.pollutant == 'PM100'),
			envType,
		}),
	},
	{
		type: 'line',
		name: 'PM2.5',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.pm25,
			envType,
		}),
	},
	{
		type: 'line',
		name: 'PM10',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.pm100,
			envType,
		}),
	},
];
export const gassEmissionTrenList: AirParamList[] = [
	{
		type: 'line',
		name: 'CH4',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ch4.value,
			envType,
		}),
	},
	{
		type: 'line',
		name: 'CO2',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.co2.value,
			envType,
		}),
	},
];
