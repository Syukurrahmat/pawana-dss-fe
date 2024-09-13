import MyLineChart from '@/components/Chart/MyLineChart';
import TagWithIcon from '@/components/common/TagWithIcon';
import useUser from '@/hooks/useUser';
import { responsiveCardSize } from '@/utils/common.utils';
import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { Alert, AlertDescription, AlertIcon, Box, Button, Card, CardBody, CardHeader, Divider, Heading, HStack, Icon, Spacer, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconCalendar, IconClick, IconDatabaseX, IconDownload } from '@tabler/icons-react'; //prettier-ignore
import { Link } from 'react-router-dom';

interface DisplayData {
	data: any;
	isLoading: boolean;
}

export default function DisplayData({ data, isLoading }: DisplayData) {
	const { screenType } = useUser();

	const airParamsList = [
		{ label: 'PM2.5', key: 'pm25' },
		{ label: 'PM10', key: 'pm100' },
		{ label: 'CO2', key: 'co2' },
		{ label: 'CH4', key: 'ch4' },
	];

	const Placeholder = (
		<HStack py="20" px="2" color="gray.500" spacing="5" justify="center">
			<Icon boxSize="50px" as={IconClick} />
			<Text fontSize="xl" fontWeight="600">
				Pilih node yang hendak Anda unduh datanya
			</Text>
		</HStack>
	);

	const Loading = (
		<HStack mx="auto" py="20" px="2" spacing="5" justify="center">
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

	const DownloadButton = (
		<Button
			size="sm"
			leftIcon={<IconDownload size="18" />}
			colorScheme="green"
			onClick={() => {
				const csvHeaders =
					'Datetime,' + airParamsList.map((e) => e.key).join(',');

				//prettier-ignore
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
			}}
			children="Unduh Data"
		/>
	);

	return (
		<Card
			size={responsiveCardSize}
			w="full"
			rounded="md"
			shadow="xs"
			bg="white"
		>
			{isLoading ? (
				<CardBody>{Loading} </CardBody>
			) : data ? (
				<>
					<CardHeader
						as={HStack}
						spacing="4"
						justify="space-between"
						align="start"
						wrap="wrap"
					>
						<Box>
							<Heading fontWeight="600" size="lg">
								{data.result.name}
							</Heading>

							<TagWithIcon colorScheme="blue" mt="2" icon={IconCalendar}>
								{data.result.lastDataSent
									? `Diperbarui pada ${toFormatedDatetime(
											data.result.lastDataSent
									  )}`
									: 'Belum Pernah Mengirim Data'}
							</TagWithIcon>
						</Box>
						<Link to={`/nodes/${data.result.nodeId}`}>
							<Button colorScheme="blue">Detail Node</Button>
						</Link>
					</CardHeader>
					<Divider borderColor="gray.300" />
					<CardBody as={VStack} align="stretch" spacing="3">
						{data.result.dataLogs.length ? (
							<>
								<Alert
									boxShadow="sm"
									fontSize="md"
									rounded="md"
									variant="left-accent"
									alignItems="start"
								>
									<AlertIcon mt="1px" />

									<AlertDescription>
										Menampilkan data
										{data.startDate == data.endDate
											? ` pada ${toFormatedDate(data.startDate)}`
											: ` dari ${toFormatedDate(
													data.startDate
											  )} hingga ${toFormatedDate(data.endDate)}`}
									</AlertDescription>
								</Alert>
								{screenType == 'mobile' && (
									<HStack justify="end">{DownloadButton}</HStack>
								)}
								<Tabs w="full" isLazy>
									<TabList>
										{airParamsList.map((e) => (
											<Tab key={e.key} children={e.label} />
										))}
										<Spacer />
										{screenType !== 'mobile' && DownloadButton}
									</TabList>

									<TabPanels>
										{airParamsList.map((e) => (
											<TabPanel key={e.key} h="350px" px="0">
												<MyLineChart
													simple
													withBrush={true}
													gasType={e.label as any}
													data={data.result.dataLogs}
													dataKeyTypeAndFunc={{
														//@ts-ignore
														func: (f) => ({ value: f[e.key] }),
													}}
													tickFormat="DD MMM YYYY HH:mm"
												/>
											</TabPanel>
										))}
									</TabPanels>
								</Tabs>
							</>
						) : (
							<HStack
								py="20"
								color="gray.500"
								spacing="5"
								justify="center"
							>
								<Icon boxSize="50px" as={IconDatabaseX} />
								<Text w="fit-content" fontSize="xl" fontWeight="600">
									Tidak Ada Data di rentang tanggal tersebut
								</Text>
							</HStack>
						)}
					</CardBody>
				</>
			) : (
				<CardBody>{Placeholder}</CardBody>
			)}
		</Card>
	);
}
