import MyMap from '@/components/Maps';
import MyMarker from '@/components/Maps/marker';
import useUser from '@/hooks/useUser';
import { UrlWithQuery, fetcher } from '@/utils/fetcher'; //prettier-ignore
import { Alert, AlertDescription, AlertIcon, Box, Card, CardBody, Flex, Spinner, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
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
	const { roleIsNot, roleIs, user } = useUser();

	const filterDisclosure = useDisclosure();
	const showCompaniesDisclosure = useDisclosure();

	const [filter, setFilters] = useState<FilterState>({ distance: 250 });
	const [showCompanies, setShowCompanies] = useState<CompanyData[]>([]);

	const currentDate = moment().format('YYYY-MM-DD');
	const map = useRef<any>();

	const [date, setDate] = useState(currentDate);

	const { data, isLoading } = useSWR<ReportsPerDay>(
		UrlWithQuery('/reports', {
			date,
			...getFilterQueries(filterDisclosure.isOpen, filter),
		}),
		fetcher
	);

	return (
		<Flex
			maxH="100%"
			direction="row"
			justify="space-between"
			alignItems="stretch"
			gap="4"
		>
			<Box
				flex="3 1 0"
				mb="auto"
				position="relative"
				h="100%"
				overflowY="auto"
				className="custom-scrollbar"
			>
				<VStack position="absolute" pr="3" w="full" spacing="3">
					<Card w="full">
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
										showCompaniesState={[
											showCompanies,
											setShowCompanies,
										]}
										showCompaniesDisclosure={showCompaniesDisclosure}
									/>
								)}
							</VStack>
						</CardBody>
					</Card>
					<Alert
						boxShadow="sm"
						fontSize="md"
						rounded="md"
						variant="left-accent"
					>
						{isLoading ? (
							<Spinner
								thickness="2px"
								colorScheme="blue"
								boxSize="20px"
								mr="3"
							/>
						) : (
							<AlertIcon />
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
					{data?.result.map((report, i) => (
						<ReportCard data={report} key={i} map={map.current} />
					))}
				</VStack>
			</Box>

			<MyMap
				flex="5 1 0"
				h="auto"
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
		</Flex>
	);
}
