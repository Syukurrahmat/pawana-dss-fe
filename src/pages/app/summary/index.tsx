import { SelectUserOrCompanyView } from '@/components/common/AdminInforCard';
import LoadingComponent from '@/components/common/LoadingComponent';
import useUser from '@/hooks/useUser';
import { responsiveCardSize } from '@/utils/common.utils';
import { fetcher } from '@/utils/fetcher';
import { Box, Card, CardBody, CardHeader, CardProps, Center, Flex, HStack, Heading, Icon, Select, Stack, StackDivider, StackProps, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconAirBalloon, IconAirConditioning, IconClipboardText, IconDatabaseOff, IconSpeakerphone } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { GRKAverageSection, ISPUAverageSection } from './AverageSection';
import { EventLogSummaryCard } from './EventLogSummaryCard';
import {
	GRKRecomendationSection,
	ISPURecomendationSection,
} from './RecomendationSection';
import { ReportSummaryCard } from './ReportSummaryCard';
import { SummaryPagination } from './SummaryPagination';
import { TrenCard } from './TrenCard';
import { airQualityTrenList, gassEmissionTrenList } from './airParamList';

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

export default function Summary() {
	const [periodeType, setPeriodeType] = useState<'month' | 'week'>('month');
	const { inputFormat, format, label } = reportIntervalOpt[periodeType];
	const [date, setDate] = useState(moment().format(inputFormat));
	const { user } = useUser();
	const [preApiUrl, setPreApiUrl] = useState<string | null>('');

	const companyId = user.view?.company?.companyId;

	const apiUrl = companyId
		? `/companies/${companyId}/summary?type=${periodeType}&periode=${date}`
		: null;

	const { data } = useSWR<SummaryData>(apiUrl, fetcher);

	if (!companyId) return <SelectUserOrCompanyView selectCompanyOnly />;

	useEffect(() => {
		setPreApiUrl(apiUrl);
	}, [apiUrl]);

	const changePeriodeTypeHandler = (e: any) => {
		const value = e.target.value as typeof periodeType;
		setPeriodeType(value);
		setDate(moment().format(reportIntervalOpt[value].inputFormat));
	};

	return (
		<Box>
			<Flex gap="4" flexWrap="wrap" align="stretch" justify="space-between">
				<Box>
					<Heading size="lg">
						Laporan {label} {moment(date).format(format)}
					</Heading>
					<Text color='dimmed'>
						{data
							? `${moment(data.meta.startDate).format('DD MMMM YYYY')} s/d ${moment(data.meta.endDate).format('DD MMMM YYYY')}` //prettier-ignore
							: 'Mengambil Data ...'}
					</Text>
				</Box>
				<HStack flexWrap="wrap" spacing="2" justify="space-between">
					<Box>
						<Text mb="1" fontSize="sm">
							Pilih Jenis Laporan
						</Text>
						<Select
							w="fit-content"
							bg="white"
							fontWeight="600"
							value={periodeType}
							onChange={changePeriodeTypeHandler}
						>
							<option value="month">Laporan Bulanan</option>
							<option value="week">Laporan Mingguan</option>
						</Select>
					</Box>
					<Box>
						<Text mb="1" fontSize="sm">
							Navigasi ke {label.toLowerCase()} lain
						</Text>
						<SummaryPagination
							state={[date, setDate]}
							type={periodeType}
							format={inputFormat}
						/>
					</Box>
				</HStack>
			</Flex>

			{!!data && preApiUrl == apiUrl ? (
				<VStack align="stretch" spacing="4" mt="6">
					
					{/* ==== Kualitas Udara (ISPU) ==== */}

					<TitleSection
						title="Kualitas Udara (ISPU)"
						colorScheme="telegram"
						icon={IconAirBalloon}
					/>

					{data.tren.length > 0 ? (
						<>
							<ISPUAverageSection
								indoor={data.averageData.indoor}
								outdoor={data.averageData.outdoor}
							/>

							<ISPURecomendationSection
								indoor={data.averageData.indoor}
								outdoor={data.averageData.outdoor}
							/>

							<TrenCard
								title="Tren Kualitas Udara"
								tren={data.tren}
								eventLogs={data.eventLogs.eventLogs}
								paramList={airQualityTrenList}
							/>
						</>
					) : (
						<NoData>Data Tidak Tersedia</NoData>
					)}

					{/* ==== Emisi Gas Rumah Kaca (CO2 dan CH4) ==== */}

					<TitleSection
						title="Emisi Gas Rumah Kaca (CO2 dan CH4)"
						colorScheme="teal"
						icon={IconAirConditioning}
					/>
					{data.tren.length > 0 ? (
						<>
							<GRKAverageSection
								indoor={data.averageData.indoor}
								outdoor={data.averageData.outdoor}
							/>

							<GRKRecomendationSection
								indoor={data.averageData.indoor}
								outdoor={data.averageData.outdoor}
							/>

							<TrenCard
								title="Tren Emisi Gas Rumah Kaca"
								tren={data.tren}
								eventLogs={data.eventLogs.eventLogs}
								paramList={gassEmissionTrenList}
							/>
						</>
					) : (
						<NoData>Data Tidak Tersedia</NoData>
					)}

					{/* ==== Aduan Di Sekitar ==== */}

					<TitleSection
						title="Aduan Di Sekitar"
						colorScheme="orange"
						icon={IconSpeakerphone}
					/>

					<ReportSummaryCard
						data={data.reports}
						company={data.meta.company}
					/>

					{/* ==== Catatan Kegiatan Perusahaan ==== */}

					<TitleSection
						title="Catatan Kegiatan Perusahaan"
						colorScheme="purple"
						icon={IconClipboardText}
					/>

					<EventLogSummaryCard
						periode={periodeType}
						data={data.eventLogs}
						dateRange={[data.meta.startDate, data.meta.endDate]}
					/>
				</VStack>
			) : (
				<HStack py="20" justify="center">
					<LoadingComponent />
				</HStack>
			)}
		</Box>
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

export function CardSection({
	title,
	...rest
}: { title?: string } & StackProps) {
	return (
		<Card size={responsiveCardSize} shadow="xs" flexGrow="1">
			{title && (
				<CardHeader fontWeight="600" fontSize="lg" children={title} />
			)}
			<CardBody
				pt="0"
				as={Stack}
				direction="row"
				divider={<StackDivider />}
				{...rest}
			/>
		</Card>
	);
}

export function NoData({ icon, ...rest }: { icon?: any } & CardProps) {
	return (
		<Card size={responsiveCardSize} shadow="xs" flexGrow="1">
			<CardBody
				as={HStack}
				justify="center"
				py="10"
				spacing="3"
				color="gray.500"
			>
				<Icon as={IconDatabaseOff} boxSize="45px" />
				<Text fontSize="xl" fontWeight="500">
					{rest.children}
				</Text>
			</CardBody>
		</Card>
	);
}
