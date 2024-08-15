import MyLineChart from '@/components/Chart/MyLineChart';
import TagWithIcon from '@/components/common/TagWithIcon';
import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import {
	Box,
	Button,
	Divider,
	Heading,
	HStack,
	Icon,
	Spacer,
	Spinner,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import { IconCalendar, IconChartAreaLine, IconClick, IconDatabaseX, IconDownload } from '@tabler/icons-react'; //prettier-ignore
import { Link } from 'react-router-dom';

interface DisplayData {
	data: any;
	isLoading: boolean;
}

const airParamsList = [
	{ label: 'PM2.5', key: 'pm25' },
	{ label: 'PM10', key: 'pm100' },
	{ label: 'CO2', key: 'co2' },
	{ label: 'CH4', key: 'ch4' },
];

export default function DisplayData({ data, isLoading }: DisplayData) {
	return (
		<Box w="full" rounded="md" shadow="xs" mt="6" bg='white'>
			{isLoading ? (
				<LoadingElement />
			) : data ? (
				<Box>
					<HStack
						justify="space-between"
						align="start"
						w="full"
						p="4"
					>
						<Box>
							<Heading fontWeight="600" size="lg">
								{data.result.name}
							</Heading>

							<TagWithIcon mt="2" icon={IconCalendar}>
								{data.result.lastDataSent
									? `Terakhir diperbarui pada ${toFormatedDatetime(
											data.result.lastDataSent
									  )}`
									: 'Belum Pernah Mengirim Data'}
							</TagWithIcon>
						</Box>
						<Link to={`/nodes/${data.result.nodeId}`}>
							<Button colorScheme="blue">Detail Node</Button>
						</Link>
					</HStack>
					<Divider/>

					<Box mt="6">
						{data.result.dataLogs.length ? (
							<>
								<HStack>
									<Icon as={IconChartAreaLine} boxSize="20px" />
									<Text fontWeight="500">
										Menampilkan data
										{data.startDate == data.endDate
											? ` pada ${toFormatedDate(data.startDate)}`
											: ` dari ${toFormatedDate(
													data.startDate
											  )} hingga ${toFormatedDate(data.endDate)}`}
									</Text>
								</HStack>

								<Tabs mt="2" w="full" isLazy>
									<TabList>
										{airParamsList.map((e) => (
											<Tab key={e.key} children={e.label} />
										))}
										<Spacer />
										<Button
											size="sm"
											leftIcon={<IconDownload size="20" />}
											colorScheme="green"
											onClick={() => downloadData(data)}
											children="Unduh Data"
										/>
									</TabList>

									<TabPanels>
										{airParamsList.map((e) => (
											<TabPanel key={e.key} h="350px" px="0">
												<MyLineChart
													withBrush={true}
													data={data.result.dataLogs}
													dataKeyTypeAndFunc={{
														envType: 'outdoor',
														//@ts-ignore
														func: (f) => f[e.key],
													}}
													tickFormat="DD MMM YYYY HH:mm"
													withoutLegend
												/>
											</TabPanel>
										))}
									</TabPanels>
								</Tabs>
							</>
						) : (
							<NoData />
						)}
					</Box>
				</Box>
			) : (
				<PlaceholderElement />
			)}
		</Box>
	);
}

function PlaceholderElement() {
	return (
		<HStack mx="auto" py="20" color="gray.500" spacing="5" justify="center">
			<Icon boxSize="50px" as={IconClick} />
			<Text fontSize="xl" fontWeight="600">
				Pilih node yang hendak Anda unduh datanya
			</Text>
		</HStack>
	);
}

function LoadingElement() {
	return (
		<HStack mx="auto" py="20" spacing="5" justify="center">
			<Spinner
				thickness="4px"
				speed="0.65s"
				emptyColor="gray.200"
				color="blue.500"
				boxSize="50px"
			/>
			<Text fontSize="xl" color="gray.500" fontWeight="600">
				Mengambil Data
			</Text>
		</HStack>
	);
}

function NoData() {
	return (
		<HStack mx="auto" py="20" color="gray.500" spacing="5" justify="center">
			<Icon boxSize="50px" as={IconDatabaseX} />
			<Text fontSize="xl" fontWeight="600">
				Tidak Ada Data di rentang tanggal tersebut
			</Text>
		</HStack>
	);
}

function downloadData(data: any) {
	const csvHeaders = 'Datetime,' + airParamsList.map((e) => e.key).join(',');
	const csvData = data.result.dataLogs
		.map((e: any) => `${e.datetime},${e.pm25},${e.pm100},${e.ch4},${e.co2}`)
		.join('\n');

	const csvContent = csvHeaders + '\n' + csvData;

	const url = URL.createObjectURL(
		new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
	);
	const link = document.createElement('a');

	link.href = url;
	link.download = `${data.result.name} ${toFormatedDate(data.startDate)}-${toFormatedDate(data.endDate)}.csv`; //prettier-ignore

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
