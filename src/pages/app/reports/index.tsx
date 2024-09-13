import MyMap from '@/components/Maps';
import MyMarker from '@/components/Maps/marker';
import useUser from '@/hooks/useUser';
import { UrlWithQuery, fetcher } from '@/utils/fetcher'; //prettier-ignore
import { Alert, AlertDescription, AlertIcon, Box, Card, CardBody, Flex, HStack, Icon, Spinner, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconList } from '@tabler/icons-react';
import moment from 'moment';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import AdvanceReportFeature from './AdvanceFeature';
import CreateReport from './CreateReport';
import ReportCard from './ReportCard';
import ReportPagination from './ReportPagination';

export type FilterState = {
	company?: any;
	nearCompany?: number;
	distance?: number;
};

const getFilterQueries = (isOpen: boolean, filter: FilterState) => {
	if (!filter.company || !isOpen) return {};

	return {
		nearCompany: filter.company.companyId,
		distance: filter.distance,
	};
};

export default function ReportsPage() {
	const { roleIsNot, screenType } = useUser();

	const filterDisclosure = useDisclosure();
	const showCompaniesDisclosure = useDisclosure();
	const map = useRef<any>();
	const currentDate = moment().format('YYYY-MM-DD');

	const [filter, setFilters] = useState<FilterState>({ distance: 250 });
	const [showCompanies, setShowCompanies] = useState<CompanyData[]>([]);
	const [date, setDate] = useState(currentDate);

	const { data, isLoading } = useSWR<ReportsPerDay>(
		UrlWithQuery('/reports', {
			date,
			...getFilterQueries(filterDisclosure.isOpen, filter),
		}),
		fetcher
	);

	const ControlCard = (
		<Card w="full" size="md">
			<CardBody>
				<VStack spacing="4">
					<CreateReport />
					<ReportPagination
						pagination={data?.pagination}
						dateState={[date, setDate]}
					/>

					{roleIsNot('regular') && (
						<AdvanceReportFeature
							filterState={[filter, setFilters]}
							filterDisclosure={filterDisclosure}
							showCompaniesState={[showCompanies, setShowCompanies]}
							showCompaniesDisclosure={showCompaniesDisclosure}
						/>
					)}
				</VStack>
			</CardBody>
		</Card>
	);

	const InfoCard = (
		<Alert
			boxShadow="sm"
			fontSize="md"
			rounded="md"
			variant="left-accent"
			alignItems="start"
		>
			{isLoading ? (
				<Spinner
					thickness="2px"
					colorScheme="blue"
					mt="1px"
					boxSize="20px"
					mr="3"
				/>
			) : (
				<AlertIcon mt="1px" />
			)}
			<AlertDescription>
				{isLoading
					? 'Mengambil Data...'
					: (data?.result.length || 'Tidak ada') +
					  (date === currentDate
							? ' aduan di 24 jam terakhir'
							: ' aduan pada tanggal ' +
							  moment(date).format('DD MMM YYYY'))}
			</AlertDescription>
		</Alert>
	);

	const ReportList = data?.result.map((report, i) => (
		<ReportCard data={report} key={i} map={map.current} />
	));

	return (
		<Flex direction={screenType == 'desktop' ? 'row' : 'column'} gap="3">
			{screenType == 'desktop' && (
				<Box
					flex="2 0 0"
					position="relative"
					overflowY="auto"
					className="custom-scrollbar"
				>
					<VStack spacing="3" position="absolute" pr="2" w="full">
						{ControlCard}
						{InfoCard}
						{ReportList}
					</VStack>
				</Box>
			)}

			{screenType != 'desktop' && (
				<VStack spacing="3">
					{ControlCard}
					{InfoCard}
				</VStack>
			)}

			<MyMap
				flex="3 0 0"
				h="auto"
				minH={{ base: '400px', lg: 'auto' }}
				marker={MyMarker.RatingMarker}
				companiesData={
					showCompaniesDisclosure.isOpen
						? showCompanies
						: filterDisclosure.isOpen && filter.company
						? [filter.company]
						: []
				}
				circleBoundaryRadius={
					filterDisclosure.isOpen ? filter.distance : undefined
				}
				data={data?.result.map((e) => ({ isReport: true, ...e })) || []}
				mapRef={map}
			/>

			{screenType !== 'desktop' && !!ReportList?.length && (
				<VStack spacing="3">
					<HStack alignSelf="start">
						<Icon boxSize="1.2em" as={IconList} />
						<Text alignSelf="start" fontWeight="600" fontSize="lg">
							Daftar Aduan
						</Text>
					</HStack>
					{ReportList}
				</VStack>
			)}
		</Flex>
	);
}
