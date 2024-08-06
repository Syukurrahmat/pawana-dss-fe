import { eventLogsTypeAttr } from '@/constants/enumVariable';
import moment from 'moment';
import { Area, AreaChart, Brush, CartesianGrid, Legend, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; // prettier-ignore
import { DatakeyFunc } from './ISPUChart';

interface LineChartData<T> {
	data: T[];
	withBrush?: boolean;
	events?: DTEventLog[];
	dataKeyTypeAndFunc?: DatakeyFunc<T> | DatakeyFunc<T>[];
	tickFormat?: string;
	withoutLegend?: boolean;
}

export default function MyLineChart<T extends { datetime: string }>({
	data,
	withBrush,
	events = [],
	withoutLegend,
	dataKeyTypeAndFunc = [],
	tickFormat = 'HH:MM',
}: LineChartData<T>) {
	dataKeyTypeAndFunc = Array.isArray(dataKeyTypeAndFunc)
		? dataKeyTypeAndFunc
		: [dataKeyTypeAndFunc];

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
					<YAxis width={30} />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip labelFormatter={(e) => moment(e).format(tickFormat)} />

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

					{!withoutLegend && (
						<Legend
							verticalAlign="top"
							height={36}
							align="right"
							wrapperStyle={{ height: '28px' }}
						/>
					)}

					{dataKeyTypeAndFunc.map(({ func, envType }, i) => (
						<Area
							key={i}
							animateNewValues={false}
							type="monotone"
							dataKey={func}
							fillOpacity={0.8}
							stroke={envType == 'indoor' ? '#82ca9d' : '#8884d8'}
							fill={`url(#colorId-${envType})`}
							name={envType == 'indoor' ? 'In-site' : 'Out-site'}
						/>
					))}

					{withBrush && (
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
