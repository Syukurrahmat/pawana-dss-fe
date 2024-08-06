import MyMap from '@/components/Maps';
import { MarkerRating } from '@/components/Maps/Marker';
import { API_URL } from '@/constants/config';
import useUser from '@/hooks/useUser';
import { buildQueriesURL, fetcher, pageDataFetcher } from '@/utils/fetcher'; //prettier-ignore
import { Alert, AlertDescription, AlertIcon, Box, Card, CardBody, Flex, HStack, IconButton, Input, Spinner, Switch, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import CreateReport from './CreateReport';
import FilterByDistance, { distanceList } from './FilterByDistance';
import ReportCard from './ReportCard';

export default function ReportsPage() {
	const currentDate = moment().format('YYYY-MM-DD');

	const {
		isOpen: filterIsOpen,
		onToggle: onToggleFilter,
		onClose: onCloseFilter,
	} = useDisclosure();
	const {
		isOpen: showCompanyIsOpen,
		onToggle: onToggleShowCompany,
		onClose: onCloseShowCompany,
	} = useDisclosure();

	const { roleIsNot, user } = useUser();
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

	const { data: allCompaniesData } = useSWR(
		showCompanyIsOpen ? '/me/companies?all=true' : null,
		pageDataFetcher
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
									<>
										<HStack w="full" justify="space-between">
											<Text fontWeight="500" alignSelf="start">
												Tampilkan Lokasi Usaha
											</Text>

											<Switch
												onChange={(e) => {
													if (e.target.checked) {
														onCloseFilter();
													}
													onToggleShowCompany();
												}}
												isChecked={showCompanyIsOpen}
											/>
										</HStack>
										<HStack w="full" justify="space-between">
											<Text fontWeight="500" alignSelf="start">
												Filter aduan di sekitar usaha Anda
											</Text>

											<Switch
												onChange={(e) => {
													if (e.target.checked) {
														onCloseShowCompany();
													}
													onToggleFilter();
												}}
												isChecked={filterIsOpen}
											/>
										</HStack>
									</>
								)}
							</VStack>

							{roleIsNot('regular') && (
								<FilterByDistance
									isOpen={filterIsOpen}
									role={user.role}
									distanceState={[distance, setDistance]}
									companyState={[company, setCompany]}
								/>
							)}
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
				companiesData={
					showCompanyIsOpen && allCompaniesData
						? allCompaniesData
						: filterIsOpen && company.companyId
						? [company]
						: []
				}
				circleBoundaryRadius={filterIsOpen ? distance : undefined}
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
