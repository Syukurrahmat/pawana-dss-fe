import { eventLogsTypeAttr } from '@/constants/enumVariable';
import { ISPUColor, getISPUProperties } from '@/utils/common.utils';
import { Box, HStack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useState } from 'react';
import { Bar, BarChart, Brush, CartesianGrid, Cell, Legend, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; //prettier-ignore

export type DatakeyFunc<T> = {
	envType: 'indoor' | 'outdoor';
	func: (e: T) => any;
};

interface MyISPUChart<T> {
	data: T[];
	withBrush?: boolean;
	withoutLegend?: boolean;
	dataKeyTypeAndFunc?: DatakeyFunc<T>[] | DatakeyFunc<T>;
	indoorDatakeyFunc?: (e: T) => any;
	outdoorDatakeyFunc?: (e: T) => any;
	events?: DTEventLog[];
	tickFormat?: string;
	offsetDomain?: moment.unitOfTime.DurationConstructor;
}

interface BrushStartEndIndex {
	startIndex?: number;
	endIndex?: number;
}

export default function MyISPUChart<T extends { datetime: string }>({
	data,
	events = [],
	withBrush,
	withoutLegend,
	dataKeyTypeAndFunc = [],
	tickFormat = 'HH:mm',
	offsetDomain = 'hour',
}: MyISPUChart<T>) {
	const [{ startIndex, endIndex }, setBrushStartEndIndex] =
		useState<BrushStartEndIndex>({
			startIndex:
				withBrush && data.length / 2 >= 12
					? Math.floor(data.length / 2)
					: undefined,
		});

	dataKeyTypeAndFunc = Array.isArray(dataKeyTypeAndFunc)
		? dataKeyTypeAndFunc
		: [dataKeyTypeAndFunc];

	data = data.sort(
		(a, b) => moment(a.datetime).valueOf() - moment(b.datetime).valueOf()
	);

	return (
		<>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={data}
					margin={{
						top: 0,
						right: 0,
						left: 0,
						bottom: 0,
					}}
				>
					<defs>
						{Object.values(ISPUColor).map((colorScheme) => (
							<pattern
								id={'strip-' + colorScheme}
								key={'strip-' + colorScheme}
								patternTransform="rotate(45)"
								width="100%"
								height="5"
								x="0"
								y="0"
								patternUnits="userSpaceOnUse"
							>
								<g>
									<rect
										x="0"
										y="0"
										width="100%"
										height="1"
										fill={`var(--chakra-colors-${colorScheme}-700)`}
									></rect>
									<rect
										x="0"
										y="1"
										width="100%"
										height="4"
										fill={`var(--chakra-colors-${colorScheme}-400)`}
									></rect>
								</g>
							</pattern>
						))}
					</defs>
					<XAxis
						dataKey={(e) => moment(e.datetime).valueOf()}
						tickFormatter={(e) => moment(e).format(tickFormat)}
						type="number"
						tickCount={data.length > 30 ? 30 : data.length + 2}
						minTickGap={10}
						domain={[
							'dataMin-' +
								moment.duration(0.5, offsetDomain).asMilliseconds(),
							'dataMax+' +
								moment.duration(0.5, offsetDomain).asMilliseconds(),
						]}
					/>
					<YAxis width={30} />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip
						labelFormatter={(e) =>
							'ISPU rata rata pada' + moment(e).format(tickFormat)
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

					{dataKeyTypeAndFunc.map(({ func, envType }, i) => (
						<Bar
							key={i}
							radius={[3, 3, 0, 0]}
							dataKey={(e) =>  func(e)?.ispu  || null} //prettier-ignore
							name={envType == 'indoor' ? 'In-site' : 'Out-site'}
						>
							{data
								.slice(
									startIndex || 0,
									endIndex ? endIndex + 1 : data.length
								)
								.map((entry, index) => {
									const { colorScheme } = getISPUProperties(
										func(entry)?.category
									);

									return (
										<Cell
											key={`cell-${index}`}
											fill={
												i == 0
													? `var(--chakra-colors-${colorScheme}-400)`
													: `url(#strip-${colorScheme})`
											}
										/>
									);
								})}
						</Bar>
					))}

					{!withoutLegend && (
						<Legend
							verticalAlign="top"
							height={36}
							align="right"
							wrapperStyle={{ height: '28px' }}
							content={({ payload }) => {
								return (
									<HStack spacing="3" justify="end">
										{payload?.map((entry, i) => (
											<HStack key={i}>
												<Box
													boxSize="15px"
													rounded="md"
													border="1px solid"
													borderColor="gray.700"
													bg={
														i
															? 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, #fff)'
															: 'white'
													}
													backgroundSize="6px 6px"
												/>

												<Text>{entry.value}</Text>
											</HStack>
										))}
									</HStack>
								);
							}}
						/>
					)}
					{withBrush && (
						<Brush
							onChange={(e) => setBrushStartEndIndex(e)}
							dataKey="datetime"
							tickFormatter={(e) => moment(e).format(tickFormat)}
							startIndex={startIndex}
							endIndex={endIndex}
						/>
					)}
				</BarChart>
			</ResponsiveContainer>
			<style>{`
								.texture_diagonal{
				fill: url(#pattern_31jsj);
				}
				.cell_default{
				fill: #cccccc;
				}
			
			`}</style>
		</>
	);
}
