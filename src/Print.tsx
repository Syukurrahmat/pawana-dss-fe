import { MAX_CH4, MAX_CO2, TRESHOLD_CH4, TRESHOLD_CO2, UNIT_PM } from '@/constants/data'; //prettier-ignore
import { getISPUProperties } from '@/utils/common.utils';
import { pageDataFetcher } from '@/utils/fetcher';
import { Box, Card, CardBody, CardHeader, Center, HStack, Heading, Icon, Select, StackDivider, Tag, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconAirBalloon, IconAirConditioning, IconClipboardText, IconReport } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import useSWR from 'swr';
import { EventLogSummaryCard } from './pages/app/summary/EventLogSummaryCard';
import { ReportSummaryCard } from './pages/app/summary/ReportSummaryCard';
import { SummaryPagination } from './pages/app/summary/SummaryPagination';
import { TrenCard } from './pages/app/summary/TrenCard';

export interface AirParamList {
	name: string;
	type: 'bar' | 'line';
	dataKeyTypeAndFunc: (envType: 'indoor' | 'outdoor') => {
		envType: 'indoor' | 'outdoor';
		func: (e: SummaryDataTren) => any;
	};
}

const airQualityTrenList: AirParamList[] = [
	{
		type: 'bar',
		name: 'ISPU',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ispu[0],
			envType,
		}),
	},
	{
		type: 'bar',
		name: 'ISPU PM2.5',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ispu.find((f) => f.pollutant == 'PM25'),
			envType,
		}),
	},
	{
		type: 'bar',
		name: 'ISPU PM10',
		dataKeyTypeAndFunc: (envType) => ({
			func: (e) => e[envType]?.ispu.find((f) => f.pollutant == 'PM100'),
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

const gassEmissionTrenList: AirParamList[] = [
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

const reportIntervalOpt = {
	month: {
		inputFormat: 'YYYY-MM',
		format: 'MMMM YYYY',
		label: 'bulan',
	},
	week: {
		inputFormat: 'YYYY-[W]ww',
		format: '[ke-]ww YYYY',
		label: 'minggu',
	},
};

export default function Print() {
	const [periode, setPeriode] = useState<'month' | 'week'>('month');
	const { inputFormat, format, label } = reportIntervalOpt[periode];
	const [date, setDate] = useState(moment().format(inputFormat));

	const { data } = useSWR<SummaryData>(
		`/summary/${periode}ly?periode=${date}`,
		pageDataFetcher
	);

	const changePeriodeTypeHandler = (e: any) => {
		const value = e.target.value as typeof periode;
		setPeriode(value);
		setDate(moment().format(reportIntervalOpt[value].inputFormat));
	};

	return (
		<Box px='4' >
			<HStack align="start" justify="space-between">
				<Box>
					<Heading size="lg">
						Laporan {label} {moment(date).format(format)}
					</Heading>
					<Text>
						{data
							? `${moment(data.meta.startDate).format('DD MMMM YYYY')} s/d ${moment(data.meta.endDate).format('DD MMMM YYYY')}` //prettier-ignore
							: 'Mengambil Data ...'}
					</Text>
				</Box>
				<HStack spacing="4">
					<Box>
						<Text mb="1" fontSize="sm">
							Navigasi ke {label.toLowerCase()} lain
						</Text>
						<SummaryPagination
							state={[date, setDate]}
							type={periode}
							format={inputFormat}
						/>
					</Box>
					<Box>
						<Text mb="1" fontSize="sm">
							Pilih Jenis Laporan
						</Text>
						<Select
							w="fit-content"
							bg="white"
							fontWeight="600"
							value={periode}
							onChange={changePeriodeTypeHandler}
						>
							<option value="month">Laporan Bulanan</option>
							<option value="week">Laporan Mingguan</option>
						</Select>
					</Box>
				</HStack>
			</HStack>

			{!!data && (
				<VStack align="stretch" spacing="4" mt="4">
					<TitleSection
						title="Kualitas Udara (ISPU)"
						colorScheme="telegram"
						icon={IconAirBalloon}
					/>

					<ISPUAverageSection
						indoor={data.averageData.indoor}
						outdoor={data.averageData.outdoor}
					/>

					<TrenCard
						title="Tren Kualitas Udara"
						tren={data.tren}
						events={data.eventLogs.eventLogs}
						paramList={airQualityTrenList}
					/>

					<TitleSection
						title="Emisi Gas Rumah Kaca (CO2 dan CH4)"
						colorScheme="teal"
						icon={IconAirConditioning}
					/>

					<GRKAverageSection
						indoor={data.averageData.indoor}
						outdoor={data.averageData.outdoor}
					/>

					<TrenCard
						title="Tren Emisi Gas Rumah Kaca"
						tren={data.tren}
						events={data.eventLogs.eventLogs}
						paramList={gassEmissionTrenList}
					/>

					<TitleSection
						title="Aduan Di Sekitar"
						colorScheme="orange"
						icon={IconReport}
					/>

					<ReportSummaryCard
						data={data.reports}
						company={data.meta.company}
					/>

					<TitleSection
						title="Catatan Kegiatan Usaha"
						colorScheme="purple"
						icon={IconClipboardText}
					/>

					<EventLogSummaryCard
						periode={periode}
						data={data.eventLogs}
						dateRange={[data.meta.startDate, data.meta.endDate]}
					/>
				</VStack>
			)}
		</Box>
	);
}

interface AverageSection {
	indoor?: SummaryDataAverage;
	outdoor?: SummaryDataAverage;
}

function ISPUAverageSection({ indoor, outdoor }: AverageSection) {
	const ispuList = [
		{ label: 'Indoor', data: indoor?.ispu[0] },
		{ label: 'Outdoor', data: outdoor?.ispu[0] },
	];

	const polutantList = [
		{
			label: 'Rerata Partikulat (PM) 2.5',
			data: [
				{ label: 'Indoor', data: indoor?.pm25 },
				{ label: 'Outdoor', data: outdoor?.pm25 },
			],
		},

		{
			label: 'Rerata Partikulat (PM) 10',
			data: [
				{ label: 'Indoor', data: indoor?.pm100 },
				{ label: 'Outdoor', data: outdoor?.pm100 },
			],
		},
	];

	return (
		<HStack align="stretch" gap="4">
			<Card size="sm" shadow="xs" flexGrow="1">
				<CardHeader
					fontWeight="600"
					pb="1"
					children="Indeks Standar Pencemar Udara (ISPU) Rata-rata"
				/>
				<CardBody pt="0" as={HStack} divider={<StackDivider />}>
					{ispuList.map(({ label, data }, i) => (
						<Box key={i} flex="1 1 0">
							<Tag
								variant="outline"
								colorScheme={i ? 'green' : 'blue'}
								mb="1"
								children={label}
							/>

							{data ? (
								<HStack spacing="3">
									<Center
										rounded="md"
										p="2"
										bg={
											getISPUProperties(data?.category).colorScheme +
											'.300'
										}
									>
										<Text
											fontSize="xl"
											fontWeight="700"
											children={
												data.ispu <= 300 ? data.ispu : '300+'
											}
										/>
									</Center>
									<Box>
										<Text fontWeight="600" fontSize="2xl" mt="-1">
											{data.category}
										</Text>
										<Text fontSize="sm" color="gray.600">
											Polutan Utama : {data.pollutant}
										</Text>
									</Box>
								</HStack>
							) : (
								<Text>-</Text>
							)}
						</Box>
					))}
				</CardBody>
			</Card>
			{polutantList.map(({ label, data }) => (
				<Card size="sm" shadow="xs" key={label}>
					<CardHeader fontWeight="600" pb="1" children={label} />
					<CardBody pt="0" as={HStack} divider={<StackDivider />}>
						{data.map(({ label, data }, i) => (
							<Box key={i} flex="1 1 0">
								<Tag
									mb="1"
									variant="outline"
									colorScheme={i ? 'green' : 'blue'}
									children={label}
								/>

								{data ? (
									<Center
										alignContent="baseline"
										rounded="md"
										p="2"
										bg={'gray.200'}
									>
										<Text
											fontSize="xl"
											fontWeight="700"
											children={data.toFixed(2)}
										/>
										<Text ml="1" fontSize="sm" children={UNIT_PM} />
									</Center>
								) : (
									<Text>-</Text>
								)}
							</Box>
						))}
					</CardBody>
				</Card>
			))}
		</HStack>
	);
}

function GRKAverageSection({ indoor, outdoor }: AverageSection) {
	const gassEmissionList = [
		{
			label: 'Emisi Gas Metana Rata-Rata',
			data: [
				{ label: 'Indoor', data: indoor?.ch4 },
				{ label: 'Outdoor', data: outdoor?.ch4 },
			],
			threshold: TRESHOLD_CH4,
			max: MAX_CH4,
			unit: 'PPM',
		},

		{
			label: 'Emisi Gas Karbonioksida Rata-Rata',
			data: [
				{ label: 'Indoor', data: indoor?.co2 },
				{ label: 'Outdoor', data: outdoor?.co2 },
			],
			threshold: TRESHOLD_CO2,
			max: MAX_CO2,
			unit: 'PPM',
		},
	];

	return (
		<HStack align="stretch" gap="4">
			{gassEmissionList.map(({ label, data, unit, threshold, max }) => (
				<Card size="sm" shadow="xs" key={label} flexGrow="1">
					<CardHeader fontWeight="600" pb="1" children={label} />
					<CardBody pt="0" as={HStack} divider={<StackDivider />}>
						{data.map(({ label, data }, i) => {
							return (
								<Box key={i} flex='1 1 0'>
									<Tag
										variant="outline"
										colorScheme={i ? 'green' : 'blue'}
										mb="1"
										children={label}
									/>

									{data ? (
										<HStack>
											<VStack spacing="1">
												<Center
													alignContent="baseline"
													rounded="md"
													p="2"
													bg={'gray.200'}
												>
													<Text
														fontSize="2xl"
														fontWeight="700"
														children={data.value.toFixed(2)}
													/>
													<Text
														ml="1"
														fontSize="sm"
														children={unit}
													/>
												</Center>
												<Tag
													w="full"
													fontSize="md"
													justifyContent="center"
												>
													{data.category}
												</Tag>
											</VStack>

											<GaugeChart
												style={{ width: '125px' }}
												arcsLength={threshold}
												colors={['#5BE12C', '#F5CD19', '#EA4228']}
												percent={data.value / max}
												arcPadding={0.02}
												hideText={true}
											/>
										</HStack>
									) : (
										<Text>-</Text>
									)}
								</Box>
							);
						})}
					</CardBody>
				</Card>
			))}
		</HStack>
	);
}

interface TitleSection {
	title: string;
	icon: any;
	colorScheme: string;
}

function TitleSection({ title, icon, colorScheme }: TitleSection) {
	return (
		<HStack
			bg={`${colorScheme}.100`}
			p="2"
			spacing="0"
			rounded="md"
			w="fit-content"
			shadow="sm"
		>
			<Center
				p="1"
				rounded="md"
				bg={`${colorScheme}.50`}
				color={`${colorScheme}.500`}
				children={<Icon as={icon} boxSize="24px" />}
			/>
			<Heading size="md" mx="3" fontWeight="600" children={title} />
		</HStack>
	);
}


