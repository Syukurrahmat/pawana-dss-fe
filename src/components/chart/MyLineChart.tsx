import { eventLogsTypeAttr } from '@/constants/enumVariable';
import moment from 'moment';
import { Area, AreaChart, Brush, CartesianGrid, Legend, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; //prettier-ignore
import { MultipleTrenTooltip, SingleTrenTooltip } from './customTooltip';
import {
	getCH4Properties,
	getCO2Properties,
	getISPUProperties,
} from '@/utils/common.utils';
import { DatakeyFunc } from './ISPUChart';
import { UNIT_CH4, UNIT_CO2, UNIT_PM } from '@/constants/data';

interface LineChartData<T> {
	data: T[];
	withBrush?: boolean;
	events?: DTEventLog[];
	dataKeyTypeAndFunc?: DatakeyFunc<T> | DatakeyFunc<T>[];
	tickFormat?: string;
	simple?: boolean;
	gasType?: 'PM2.5' | 'PM10' | 'CH4' | 'CO2';
}

export default function MyLineChart<T extends { datetime: string }>({
	data,
	events = [],
	dataKeyTypeAndFunc = [],
	tickFormat = 'HH:MM',
	simple,
	withBrush,
	gasType,
}: LineChartData<T>) {
	dataKeyTypeAndFunc = Array.isArray(dataKeyTypeAndFunc)
		? dataKeyTypeAndFunc
		: [dataKeyTypeAndFunc];

	const tooltipGetPropertiesFunc =
		gasType == 'PM2.5' || gasType == 'PM10'
			? getISPUProperties
			: gasType == 'CH4'
			? getCH4Properties
			: gasType == 'CO2'
			? getCO2Properties
			: undefined;

	const tooltipLabel = gasType
		? gasType.startsWith('PM')
			? 'Pencemar ' + gasType
			: gasType == 'CH4'
			? 'Metana'
			: 'Karbondioksida'
		: undefined;

	const unit = gasType
		? gasType.startsWith('PM')
			? UNIT_PM
			: gasType == 'CH4'
			? UNIT_CH4
			: UNIT_CO2
		: undefined;

	return (
		<>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={data.sort(
						(a, b) =>
							moment(a.datetime).valueOf() - moment(b.datetime).valueOf()
					)}
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient
							id="colorId-outdoor"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
						</linearGradient>
						<linearGradient
							id="colorId-indoor"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis
						type="number"
						dataKey={(e) => moment(e.datetime).valueOf()}
						domain={['dataMin-10000', 'dataMax+10000']}
						tickFormatter={(e) => moment(e).format(tickFormat)}
						tickCount={30}
						minTickGap={10}
					/>
					<YAxis  width={gasType == 'PM10' || gasType == 'PM2.5' ? 36 : 44}/>
					<CartesianGrid strokeDasharray="3 3" />

					<Tooltip
						content={
							simple ? (
								// @ts-ignore
								<SingleTrenTooltip
									tickFormat={tickFormat}
									dataKeyTypeAndFunc={dataKeyTypeAndFunc}
									tooltipLabel={tooltipLabel}
									getPropertiesFunc={tooltipGetPropertiesFunc}
									unit={unit}
								/>
							) : (
								// @ts-ignore
								<MultipleTrenTooltip
									tickFormat={tickFormat}
									dataKeyTypeAndFunc={dataKeyTypeAndFunc}
									tooltipLabel={tooltipLabel}
									getPropertiesFunc={tooltipGetPropertiesFunc}
									unit={unit}
								/>
							)
						}
					/>

					{!!events.length &&
						events.map((event) => (
							<ReferenceArea
								key={event.eventLogId}
								x1={moment(event.startDate).startOf('d').valueOf()}
								x2={
									event.endDate
										? moment(event.endDate).endOf('d').valueOf()
										: undefined
								}
								ifOverflow="hidden"
								fill={`var(--chakra-colors-${eventLogsTypeAttr[event.type]?.color || 'gray'}-500)`} //prettier-ignore
								fillOpacity={0.1}
							/>
						))}

					{!simple && (
						<Legend
							verticalAlign="top"
							align="right"
							wrapperStyle={{ height: 'max-content', padding : '12px 0 ' }}
						/>
					)}

					{dataKeyTypeAndFunc.map(({ func, envType }, i) => (
						<Area
							key={i}
							animateNewValues={false}
							type="monotone"
							dataKey={(e) =>
								func(e)?.value || func(e)?.pollutantValue || null
							}
							fillOpacity={0.8}
							stroke={envType == 'indoor' ? '#82ca9d' : '#8884d8'}
							fill={`url(#colorId-${envType || 'outdoor'})`}
							name={
								envType == 'indoor'
									? 'Di dalam perusahaan'
									: 'Di sekitar perusahaan'
							}
						/>
					))}

					{(!simple || withBrush) && (
						<Brush
							dataKey="datetime"
							tickFormatter={(e) => moment(e).format(tickFormat)}
							startIndex={
								data.length / 2 < 15
									? undefined
									: Math.floor(data.length / 2)
							}
						/>
					)}
				</AreaChart>
			</ResponsiveContainer>
		</>
	);
}
