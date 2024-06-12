import MyLineChart from '@/components/Chart/MyLineChart';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import TagWithIcon from '@/components/common/TagWithIcon';
import { API_URL } from '@/constants/config';
import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { buildQueriesURL } from '@/utils/fetcher';
import { Box, Button, Container, Divider, Flex, HStack, Heading, Icon, Spacer, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useToast } from '@chakra-ui/react'; //prettier-ignore
import { IconCalendar, IconChartAreaLine, IconCircleDot, IconClick, IconDatabaseX, IconDownload, IconSend2 } from '@tabler/icons-react'; //prettier-ignore
import axios from 'axios';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SelectDateRange from './selectDateRange';

const airParamsList = [
	{ label: 'PM2.5', key: 'pm25' },
	{ label: 'PM10', key: 'pm100' },
	{ label: 'CO2', key: 'co2' },
	{ label: 'CH4', key: 'ch4' },
];

export default function Data() {
	const location = useLocation();

	const toast = useToast();
	const [data, setData] = useState<DataPageData | null>(null);
	const [tabIndex, setTabIndex] = useState(0);

	const { values, setFieldValue, handleSubmit, isSubmitting, setSubmitting } =
		useFormik({
			initialValues: {
				selectedNode: { nodeId: -1 },
				dateRange: {
					startDate: new Date(),
					endDate: new Date(),
				},
			},
			onSubmit: (values) => {
				const { nodeId } = values.selectedNode;
				const { startDate, endDate } = values.dateRange;

				if (nodeId <= 0) {
					toast({
						title: 'Oppsss',
						description: 'Pilih Node terlebih Dahulu',
						status: 'warning',
					});
					setSubmitting(false);
					return;
				}

				const requestURL = buildQueriesURL(
					`${API_URL}/nodes/${nodeId}/datalogs`,
					{
						start: startDate.toISOString(),
						end: endDate.toISOString(),
					}
				);

				axios.get(requestURL).then((res) => {
					setSubmitting(false);

					window.history.replaceState(
						null,
						'',
						location.pathname +
							'?' +
							new URLSearchParams({
								nodeId: nodeId.toString(),
								start: moment(startDate).format('YYYY-MM-DD'),
								end: moment(endDate).format('YYYY-MM-DD'),
							}).toString()
					);

					setData(res.data);
				});
			},
		});

	useEffect(() => {
		const queryParams = Object.fromEntries(
			new URLSearchParams(location.search)
		);
	}, []);

	return (
		<Box>
			<Heading size="lg">Akses data yang dikirim dari Node</Heading>
			<Text>
				Pilih Grup yang Anda ikut, lalu pilih node mana yang hendak diakses,
			</Text>

			<form onSubmit={handleSubmit}>
				<Flex mt="4" gap="4" flexWrap="wrap">
					<SelectFromDataTable
						maxW="300px"
						selectValue={values.selectedNode}
						selectOnChange={(e) => setFieldValue('selectedNode', e)}
						itemName="node"
						leftIcon={<IconCircleDot size="30" />}
						apiUrl={`/nodes/downloadable`}
						border="0px solid"
						shadow="xs"
						displayRow={(row: any) => (
							<HStack>
								<IconCircleDot />
								<Text>{row.name}</Text>
							</HStack>
						)}
					/>

					<SelectDateRange
						maxW="300px"
						dateRangeValue={values.dateRange}
						onChangeDateRange={(e) => setFieldValue('dateRange', e)}
					/>

					<Button
						maxW="300px"
						py="8"
						size="lg"
						fontSize="md"
						shadow="xs"
						border="0px solid"
						bg="gray.50"
						colorScheme="blue"
						variant="outline"
						type="submit"
						rightIcon={<IconSend2 size="20" />}
					>
						<Text w="full" textAlign="start">
							Dapatkan Data
						</Text>
					</Button>
				</Flex>
			</form>
			<Divider my="4" borderColor="gray.400" />
			<Container maxW="container.md" mt="4">
				{isSubmitting ? (
					<LoadingElement />
				) : data ? (
					<Box>
						<HStack
							justify="space-between"
							align="start"
							w="full"
							p="3"
							border="1px solid"
							borderColor="gray.300"
							rounded="md"
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
												  )} hingga ${toFormatedDate(
														data.endDate
												  )}`}
										</Text>
									</HStack>

									<Tabs
										w="full"
										isLazy
										index={tabIndex}
										onChange={setTabIndex}
									>
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
														data={data.result.dataLogs.map(
															(dt) => ({
																// @ts-ignore
																value: dt[e.key],
																datetime: dt.datetime,
															})
														)}
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
			</Container>
		</Box>
	);
}

function PlaceholderElement() {
	return (
		<HStack mx="auto" py="10" color="gray.500" spacing="5" justify="center">
			<Icon boxSize="50px" as={IconClick} />
			<Text fontSize="xl" fontWeight="600">
				Pilih Node yang Hendak Anda unduh data
			</Text>
		</HStack>
	);
}

function LoadingElement() {
	return (
		<HStack mx="auto" py="10" spacing="5" justify="center">
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
		<HStack mx="auto" py="10" color="gray.500" spacing="5" justify="center">
			<Icon boxSize="50px" as={IconDatabaseX} />
			<Text fontSize="xl" fontWeight="600">
				Tidak Ada Data di rentang tanggal tersebut
			</Text>
		</HStack>
	);
}

function downloadData(data: DataPageData) {
	const csvHeaders = 'Datetime,' + airParamsList.map((e) => e.key).join(',');
	const csvData = data.result.dataLogs
		.map((e) => `${e.datetime},${e.pm25},${e.pm100},${e.ch4},${e.co2}`)
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
