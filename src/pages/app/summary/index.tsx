import { Box, HStack, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Divider, IconButton, Input, Spacer, Button, Flex, Icon, Card, CardHeader, CardBody } from '@chakra-ui/react'; //prettier-ignore
import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import { IconCalendarMonth, IconCalendarWeek, IconChartAreaLine, IconChevronLeft, IconChevronRight, IconMoodSmile } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import moment from 'moment';
import { useHashBasedTabsIndex } from '@/hooks/useHashBasedTabsIndex';
import useSWR from 'swr';
import { apiFetcher } from '@/utils/fetcher';
import MyLineChart from '@/components/Chart/MyLineChart';

export default function Assesment() {
	const [tabIndex, onTabChange] = useHashBasedTabsIndex(['monthly', 'weekly']);

	return (
		<Box>
			<HStack justify="space-between">
				<Box>
					<Heading size="lg">Laporan </Heading>
					<Text>
						Akses Laporan minggguan atau bulanan dari Usaha Anda
					</Text>
				</Box>

				<ChangeActiveDashboard colorScheme="blue"></ChangeActiveDashboard>
			</HStack>

			<Tabs
				onChange={onTabChange}
				index={tabIndex}
				variant="soft-rounded"
				colorScheme="blue"
				mt="4"
			>
				<TabList gap="2">
					<Tab rounded="xl" gap="1">
						<IconCalendarMonth size="20" /> <Text>Bulanan</Text>
					</Tab>
					<Tab rounded="xl" gap="1">
						<IconCalendarWeek size="20" /> <Text>Mingguan</Text>
					</Tab>
				</TabList>
				<Divider borderColor="gray.400" mt="2" />
				<TabPanels>
					<TabPanel px="0">
						<MonthltReport />
					</TabPanel>
					<TabPanel px="0">
						<WeeklyReport />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}

const airParamsData = [
	{ name: 'ISPU', key: 'ispu' },
	{ name: 'PM2.5', key: 'pm25' },
	{ name: 'PM10', key: 'pm100' },
	{ name: 'CH4', key: 'ch4' },
	{ name: 'CO2', key: 'co2' },
];

function MonthltReport() {
	const [month, setMonth] = useState(moment().format('YYYY-MM'));
	const [selectedParam, setSelectedParam] = useState(1);

	const { data, isLoading } = useSWR<DataPageData>(
		'/summary/monthly?month=' + month,
		apiFetcher
	);

	

	const averageList = [
		{ title: 'Rerata ISPU', value: 12, emoji: IconMoodSmile, note: 'Baik' },
		{ title: 'Rerata PM2.5', value: 12, emoji: IconMoodSmile, note: 'Baik' },
		{ title: 'Rerata PM10', value: 12, emoji: IconMoodSmile, note: 'Baik' },
		{ title: 'Rerata CO2', value: 12, emoji: IconMoodSmile, note: 'Baik' },
		{ title: 'Rerata CO2', value: 12, emoji: IconMoodSmile, note: 'Baik' },
	];

	return (
		<Box>
			<HStack>
				<Box>
					<Heading size="md">
						Laporan Bulan {moment(month).format('MMMM YYYY')}
					</Heading>
					<Text>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</Text>
				</Box>
				<Spacer />
				<AssesmentPagination state={[month, setMonth]} />
			</HStack>
			<Box>
				<Flex mt="4" gap="4">
					{averageList.map((e, i) => (
						<Box
							key={i}
							flex="1 1 0"
							border="1px solid"
							borderColor="gray.400"
							py="2"
							px="4"
							rounded="md"
						>
							<Text>{e.title}</Text>
							<HStack justify="space-between">
								<Heading as="p" size="lg">
									1
								</Heading>
								<Icon as={IconMoodSmile} boxSize="30px" />
							</HStack>
						</Box>
					))}
				</Flex>

				<Card size="sm" mt="4">
					<CardBody py="4">
						<Tabs isLazy variant="unstyled" colorScheme="teal" size="sm">
							<TabList gap="2">
								<Icon as={IconChartAreaLine} boxSize="20px" />
								<Heading size="md" fontSize="lg" fontWeight="600">
									Tren Paramater Udara
								</Heading>
								<Spacer />
								{airParamsData.map((e, i) => (
									<Tab
										rounded="md"
										as={Button}
										size="sm"
										colorScheme="teal"
										border="1px solid"
										borderColor="teal.500"
										_selected={{
											bg: 'teal.500',
											color: 'white',
											// variant: 'solid',
										}}
										variant="outline"
										children={e.name}
										key={i}
									/>
								))}
							</TabList>
							<Divider my="2" borderColor="gray.300" />
							<TabPanels>
								{airParamsData.map((e, i) => (
									<TabPanel key={i} h="350px">

										<pre>{JSON.stringify(data, null, 4)}</pre>
										{/* <MyLineChart
											//@ts-ignore
											data={
												!tren
													? []
													: tren.map((dt) => ({
															//@ts-ignore
															value: dt[e.key],
															datetime: dt.datetime,
													  }))
											}
										/> */}
									</TabPanel>
								))}
							</TabPanels>
						</Tabs>
					</CardBody>
				</Card>
				<Flex w="full" gap="4" mt="4">
					<Card size="sm" flex="4 1 0">
						<CardHeader></CardHeader>
						<CardBody></CardBody>
					</Card>
					<Card size="sm" flex="3 1 0">
						<CardHeader></CardHeader>
						<CardBody></CardBody>
					</Card>
				</Flex>
			</Box>
		</Box>
	);
}

function WeeklyReport() {
	const [week, setWeek] = useState(moment().format('YYYY-[W]ww'));

	return (
		<Box>
			<HStack>
				<Box>
					<Heading size="md">
						Laporan Minggu ke-{moment(week).format('ww YYYY')}{' '}
					</Heading>
					<Text>
						{week}
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
					</Text>
				</Box>
				<Spacer />
				<AssesmentPagination state={[week, setWeek]} type="week" />
			</HStack>
		</Box>
	);
}

interface AssPage {
	state: StateOf<string>;
	type?: 'month' | 'week';
}

function AssesmentPagination({ state, type = 'month' }: AssPage) {
	const [date, setDate] = state;

	const format = type == 'month' ? 'YYYY-MM' : 'YYYY-[W]ww';

	return (
		<HStack justify="space-between">
			<IconButton
				bg="white"
				variant="outline"
				icon={<IconChevronLeft />}
				aria-label="previous"
				onClick={() =>
					setDate(moment(date).subtract(1, type).format(format))
				}
			/>
			<Input
				fontWeight="600"
				variant="outline"
				onFocus={(e) => e.target.showPicker()}
				type={type}
				bg="white"
				w="fit-content"
				textAlign="center"
				max={moment().format(format)}
				onChange={(e) => setDate(e.target.value)}
				value={date}
			/>
			<IconButton
				variant="outline"
				icon={<IconChevronRight />}
				aria-label="next"
				bg="white"
				isDisabled={moment(date).isAfter(moment().startOf(type))}
				onClick={() => setDate(moment(date).add(1, type).format(format))}
			/>
			<Button
				variant="outline"
				bg="white"
				onClick={() => setDate(moment().format(format))}
				children={type == 'month' ? 'Bulan Ini' : 'Minggu Ini'}
			/>
		</HStack>
	);
}
