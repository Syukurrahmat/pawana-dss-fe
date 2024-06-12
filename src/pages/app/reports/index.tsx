import MyMap from '@/components/Maps';
import { MarkerRating } from '@/components/Maps/Marker';
import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import { API_URL } from '@/constants/config';
import { buildQueriesURL, fetcher } from '@/utils/fetcher';
import { Alert, AlertDescription, AlertIcon, Box, Card, CardBody, Collapse, Flex, HStack, IconButton, Input, Select, Spinner, Switch, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import CreateReport from './CreateReport';
import ReportCard from './ReportCard';

const distanceList = [
	{ distance: 250, label: '250 m' },
	{ distance: 500, label: '500 m' },
	{ distance: 1000, label: '1 km' },
	{ distance: 2500, label: '2,5 km' },
];

export default function ReportsPage() {
	const currentDate = moment().format('YYYY-MM-DD');
	const { isOpen: filterIsOpen, onToggle } = useDisclosure();

	const [date, setDate] = useState(currentDate);
	const [company, setCompany] = useState<any>({});
	const [distance, setDistance] = useState(distanceList[0].distance);
	const map = useRef<any>();


	const filterQueries =
		filterIsOpen && company.companyId
			? { nearCompany: company.companyId, distance: distance }
			: {};

	const isToday = date === currentDate;
	const { data, isLoading } = useSWR<ReportsPerDay>(
		buildQueriesURL(API_URL + '/reports', {
			date,
			...filterQueries,
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

								<HStack w="full" justify="space-between">
									<Text fontWeight="500" alignSelf="start">
										Filter aduan di sekitar usaha Anda
									</Text>

									<Switch
										onChange={onToggle}
										isChecked={filterIsOpen}
									/>
								</HStack>
							</VStack>

							<FilterByDistance
								isOpen={filterIsOpen}
								distanceState={[distance, setDistance]}
								companyState={[company, setCompany]}
							/>
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
								  (isToday
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
				marker={MarkerRating}
				companiesData={filterIsOpen && company.companyId ? [company] : []}
				circleBoundaryRadius={filterIsOpen ? distance : undefined}
				data={data?.result.map((e) => ({ isReport: true, ...e })) || []}
				mapRef={map}
			/>
		</Flex>
	);
}

interface FilterDist {
	isOpen: boolean;
	distanceState: StateOf<number>;
	companyState: StateOf<{}>;
}

function FilterByDistance({ isOpen, distanceState, companyState }: FilterDist) {
	const [companyId, setCompanyId] = companyState;
	const [distance, setDistance] = distanceState;

	return (
		<Box w="full">
			<Collapse in={isOpen} animateOpacity>
				<HStack spacing="3" mt="4">
					<Box as="label" flexGrow="1">
						<Text mb="1">Usaha</Text>

						<SelectFromDataTable
							w="200px"
							fontWeight="400"
							itemName="Usaha"
							hiddenTitleButton={true}
							apiUrl="/me/companies"
							selectValue={companyId}
							selectOnChange={setCompanyId}
							hiddenSearchInput={true}
							borderColor="gray.200"
							color="gray.700"
							displayRow={(e: any) => (
								<HStack>
									<CompanyIcon bg="white" type={e.type} />
									<Text children={e?.name || 'Node yang Anda ikuti'} />
								</HStack>
							)}
						/>
					</Box>
					<Box as="label" flexGrow="1">
						<Text mb="1">Jarak</Text>
						<Select
							value={distance}
							onChange={(e) => setDistance(parseInt(e.target.value))}
							children={distanceList.map((e) => (
								<option value={e.distance} children={e.label} />
							))}
						/>
					</Box>
				</HStack>
			</Collapse>
		</Box>
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
