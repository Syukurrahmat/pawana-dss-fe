import MyMap from '@/components/Maps';
import MyMarker from '@/components/Maps/marker';
import { TagCompanyType } from '@/components/Tags/index.tags';
import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import CompanyIcon from '@/components/common/CompanyIcon';
import TagWithIcon from '@/components/common/TagWithIcon';
import useUser from '@/hooks/useUser';
import { getISPUProperties } from '@/utils/common.utils';
import { toFormatedDate } from '@/utils/dateFormating';
import { Alert, Box, Button, Card, CardBody, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCalendar, IconCircleDot } from '@tabler/icons-react'; // prettier-ignore
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardInfo({ data }: { data: DashboardDataType }) {
	const { dashboardInfo, nodes } = data;
	const { name, type, coordinate, countNodes, companyId, userId, createdAt } = dashboardInfo; //prettier-ignore
	const [selectedParam, setSelectedParam] = useState<null | number>(null);
	const { roleIsNot, roleIs, user } = useUser();

	const airParamsData = (x: 'indoor' | 'outdoor' = 'outdoor') => [
		{
			name: 'ISPU',
			currentData: nodes[x]?.map((e) => {
				const ispuValues = e.latestData?.ispu;
				if (!ispuValues) return { ...e, data: { name: 'ISPU' } };
				const { datetime, value } = ispuValues;
				if (!value || !value[0]) return { ...e, data: { name: 'ISPU' } };
				const { ispu, category } = value[0];

				return {
					...e,
					data: {
						name: 'ISPU',
						datetime,
						value: ispu,
						color: getISPUProperties(category).colorScheme,
					},
				};
			}),
		},
		{
			name: 'PM2.5',
			currentData: nodes[x]?.map((e) => ({
				...e,
				data: {
					name: 'PM2.5',
					...e.latestData?.pm25,
				},
			})),
		},
		{
			name: 'PM10',
			currentData: nodes[x]?.map((e) => ({
				...e,
				data: {
					name: 'PM10',
					...e.latestData?.pm100,
				},
			})),
		},
		{
			name: 'CH4',
			currentData: nodes[x]?.map((e) => {
				if (!e.latestData) return { ...e, data: { name: 'CH4' } };
				const { datetime, value } = e.latestData.ch4;

				return {
					...e,
					data: {
						name: 'CH4',
						datetime,
						value: value.value,
						color: '',
					},
				};
			}),
		},
		{
			name: 'CO2',
			currentData: nodes[x]?.map((e) => {
				if (!e.latestData) return { ...e, data: { name: 'CO2' } };
				const { datetime, value } = e.latestData.co2;

				return {
					...e,
					data: {
						name: 'CO2',
						datetime,
						value: value.value,
						color: '',
					},
				};
			}),
		},
	];

	const companyData = {
		name,
		type,
		coordinate,
		companyId,
		indoorNodeValue:
			selectedParam !== null
				? airParamsData('indoor')[selectedParam].currentData
				: null,
	};

	const displayedData =
		selectedParam !== null
			? airParamsData()[selectedParam].currentData
			: nodes.outdoor;

	const dashboardName = name
		? name
		: 'Dasbor ' + (roleIs(['admin', 'gov']) ? user.view?.user?.name : 'Anda');

	return (
		<Card size="sm" w="full">
			<CardBody as={Flex} gap="5">
				<MyMap
					w="60%"
					h="275px"
					companiesData={companyId ? [companyData] : []}
					marker={
						selectedParam === null
							? MyMarker.DetailNodesMarker
							: MyMarker.ValueMarker
					}
					data={displayedData || []}
				/>

				<VStack align="start" p="1" flexGrow="1">
					<HStack mt="6">
						<CompanyIcon type={type} />
						<Heading
							size="md"
							fontWeight="600"
							children={dashboardName}
						/>
					</HStack>
					<HStack mt="2">
						{!!createdAt && (
							<>
								<TagWithIcon
									icon={IconCalendar}
									colorScheme="blue"
									children={`Dibuat pada ${toFormatedDate(createdAt)}`}
								/>
							</>
						)}
						{type !== 'regular' && <TagCompanyType value={type} />}
						<TagWithIcon
							icon={IconCircleDot}
							children={countNodes + ' Node'}
						/>
					</HStack>

					<Spacer />
					{countNodes > 0 ? (
						<Box>
							<Text>Tampilkan nilai dari parameter : </Text>
							<Flex flexWrap="wrap" gap="3" mt="1">
								{airParamsData().map((e, i) => (
									<Button
										key={i}
										size="sm"
										colorScheme="teal"
										border="1px solid"
										borderColor="teal.500"
										variant={selectedParam == i ? 'solid' : 'outline'}
										onClick={() =>
											setSelectedParam((e) => (e != i ? i : null))
										}
										children={e.name}
									/>
								))}
							</Flex>
						</Box>
					) : (
						<Alert fontSize="md" status="warning" rounded="md">
							<Text >
								Tidak ada node yang dapat dianalisis. 
								<br/>Tambahkan node
								untuk memulai memantau kualitas udara
							</Text>
						</Alert>
					)}
					<HStack justify="end" w="full" mt="4">
						{roleIsNot('regular') && (
							<ChangeActiveDashboard
								colorScheme="blue"
								selectCompanyOnly={roleIsNot(['admin', 'gov'])}
							>
								Ganti Dashboard
							</ChangeActiveDashboard>
						)}
						{roleIs(['admin', 'gov']) && type == 'regular' && (
							<Link to={`/users/${userId}`}>
								<Button colorScheme="blue" ml="2">
									Detail Pengguna
								</Button>
							</Link>
						)}

						{!!companyId && (
							<Link to={`/companies/${companyId}`}>
								<Button colorScheme="blue" ml="2">
									Detail Perusahaan
								</Button>
							</Link>
						)}
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
}
