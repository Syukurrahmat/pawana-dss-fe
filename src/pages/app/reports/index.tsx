import { IconChevronLeft, IconChevronRight, IconFilter } from '@tabler/icons-react'; //prettier-ignore
import { AbsoluteCenter, Box, Divider, HStack, Tag, Stack, VStack, IconButton, Input, Skeleton, Text, Select, Icon, Center} from '@chakra-ui/react'; //prettier-ignore
import MyMap from '@/components/maps/index.maps';
import { toFormatedDate } from '@/utils/dateFormating';
import { apiFetcher } from '@/utils/fetcher';
import CreateReport from './CreateReport';
import ReportCard from './ReportCard';
import { useState } from 'react';
import useSWR from 'swr';
import { MarkerRating } from '@/components/maps/Marker';
import moment from 'moment';

export default function ReportsPage() {
	const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

	const { data, isLoading, error } = useSWR<ReportsPerDay>(
		`/reports?date=${date}&timezoneOffset=${new Date().getTimezoneOffset()}`,
		apiFetcher
	);

	const pagination = data?.pagination;

	return (
		<Stack
			display="flex"
			maxH="100%"
			direction="row"
			justify="space-between"
			alignItems="stretch"
		>
			<Box
				flex="0 0 35%"
				mb="auto"
				position="relative"
				h="100%"
				overflowY="auto"
			>
				<VStack position="absolute" pr="3" w="full">
					<VStack
						shadow="xs"
						rounded="md"
						spacing="3"
						bg="white"
						w="full"
						p="3"
						mb="4"
					>
						<CreateReport />
						<HStack justify="space-between" w="full">
							<IconButton
								variant="outline"
								icon={<IconChevronLeft />}
								aria-label="previous"
								isDisabled={pagination ? !pagination.previous : true}
								onClick={() =>
									pagination ? setDate(pagination.previous) : null
								}
							/>
							<Input
								variant="outline"
								onFocus={(e) => e.target.showPicker()}
								type="date"
								textAlign="center"
								max={moment().format('YYYY-MM-DD')}
								onChange={(e) => setDate(e.target.value)}
								value={pagination ? pagination.current : date}
							/>
							<IconButton
								variant="outline"
								icon={<IconChevronRight />}
								aria-label="next"
								isDisabled={pagination ? !pagination.next : true}
								onClick={() =>
									pagination ? setDate(pagination.next) : null
								}
							/>
						</HStack>
						<HStack w="full">
							<Center
								boxSize="10"
								border="1px solid"
								borderColor="gray.200"
								rounded="md"
								children={<IconFilter size="20" />}
							/>
							<Select w="fit-content">
								<option value="option1">Semua Laporan</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select>
						</HStack>
						<Text alignSelf="start">
							{date === moment().format('YYYY-MM-DD')
								? `${data?.result.length} laporan 24 jam terakhir`
								: `${data?.result.length} laporan pada tanggal ${moment(
										date
								  ).format('DD MMM YYYY')}`}
						</Text>
					</VStack>

					{data
						? data.result.map((report, i) => (
								<ReportCard data={report} key={i} />
						  ))
						: Array(5)
								.fill(null)
								.map((_, i) => (
									<Skeleton key={i} w="full" rounded="md" h="150px" />
								))}
				</VStack>
			</Box>
			<MyMap
				flex="0 0 65%"
				h="auto"
				marker={MarkerRating}
				data={data?.result || []}
			/>
		</Stack>
	);
}

function DividerWithDate({ date }: { date: string }) {
	return (
		<Box position="relative" py="6">
			<Divider borderColor="gray.400" />
			<AbsoluteCenter>
				<Tag px="8" colorScheme="blue">
					{toFormatedDate(date)}
				</Tag>
			</AbsoluteCenter>
		</Box>
	);
}

const SWRGetKey = (pageIndex: number, previousPageData: any) => {
	if (previousPageData && !previousPageData.length) return null;
	return `/reports?page=${pageIndex}&timezoneOffset=${new Date().getTimezoneOffset()}`;
};
