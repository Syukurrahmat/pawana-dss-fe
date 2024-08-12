import MyMap from '@/components/Maps';
import MyMarker from '@/components/Maps/marker';
import useUser from '@/hooks/useUser';
import { UrlWithQuery, fetcher } from '@/utils/fetcher'; //prettier-ignore
import { Alert, AlertDescription, AlertIcon, Box, Card, CardBody, Flex, HStack, IconButton, Input, Spinner, Switch, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import CreateReport from './CreateReport';
import ReportCard from './ReportCard';
import AdvanceFeature, { distanceList } from './AdvanceFeature';

type FilterState = {
	company : CompanyData
	nearCompany: number;
	distance: number;

};

export default function ReportsPage() {
	const filterDisclosure = useDisclosure();
	const showCompaniesDisclosure = useDisclosure();

	const currentDate = moment().format('YYYY-MM-DD');
	const map = useRef<any>();

	const { roleIsNot, roleIs, user } = useUser();

	const [date, setDate] = useState(currentDate);
	const [filterState, setFilterState] = useState<FilterState>();

	const allCompaniesURL = roleIs(['admin', 'gov'])
		? `/companies/all=true&view=simple`
		: `/users/${user.userId}/companies?all=true`;
	
	const { data, isLoading } = useSWR<ReportsPerDay>(
		UrlWithQuery('/reports', { date, ...filterState }),
		fetcher
	);

	const { data: allCompanies } = useSWR<CompanyData[]>(
		showCompaniesDisclosure.isOpen ? allCompaniesURL : null,
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
									<AdvanceFeature
										filterDisclosure={filterDisclosure}
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
					showCompaniesDisclosure.isOpen && allCompanies
						? allCompanies
						: filterState
						? [filterState.company]
						: []
				}
				circleBoundaryRadius={
					filterState
						? filterState.distance
						: undefined
				}
				data={data?.result.map((e) => ({ isReport: true, ...e })) || []}
				mapRef={map}
			/>
		</Flex>
	);
}

interface ReportPagination {
	pagination: ReportsPagination | undefined;
	dateState: StateOf<string>;
}

function ReportPagination({ pagination, dateState }: ReportPagination) {
	const [date, setDate] = dateState;

	const next = pagination?.next;
	const previous = pagination?.previous;
	const current = pagination?.current;

	return (
		<HStack justify="space-between" w="full">
			<IconButton
				variant="outline"
				icon={<IconChevronLeft />}
				aria-label="previous"
				isDisabled={!previous}
				onClick={() => (previous ? setDate(previous) : null)}
			/>
			<Input
				variant="outline"
				onFocus={(e) => e.target.showPicker()}
				type="date"
				textAlign="center"
				max={moment().format('YYYY-MM-DD')}
				onChange={(e) => setDate(e.target.value)}
				value={current || date}
			/>
			<IconButton
				variant="outline"
				icon={<IconChevronRight />}
				aria-label="next"
				isDisabled={!next}
				onClick={() => (next ? setDate(next) : null)}
			/>
		</HStack>
	);
}
