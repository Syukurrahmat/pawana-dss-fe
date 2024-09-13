import MyMap from '@/components/Maps';
import MyMarker from '@/components/Maps/marker';
import { TagCompanyType } from '@/components/Tags/index.tags';
import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import CompanyIcon from '@/components/common/CompanyIcon';
import TagWithIcon from '@/components/common/TagWithIcon';
import useUser from '@/hooks/useUser';
import { getISPUProperties } from '@/utils/common.utils';
import { toFormatedDate } from '@/utils/dateFormating';
import { Alert, Box, Button, ButtonGroup, Card, CardBody, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCalendar, IconCircleDot } from '@tabler/icons-react'; // prettier-ignore
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const baseLgStyle = (base: any, lg: any) => ({
	base,
	lg,
});

export default function DashboardInfo({ data }: { data: DashboardDataType }) {
	const { dashboardInfo, nodes } = data;
	const { name, type, coordinate, countNodes, companyId, userId, createdAt } = dashboardInfo; //prettier-ignore
	const [selectedParam, setSelectedParam] = useState<null | number>(null);
	const { roleIsNot, roleIs, user } = useUser();
	const navigate = useNavigate();

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
		<Card size="sm" w="full" rounded='md'>
			<CardBody as={Flex} flexDir={baseLgStyle('column', 'row')} gap={2}>
				<MyMap
					minH="275px"
					h="275px"
					flex="4 1 0"
					companiesData={companyId ? [companyData] : []}
					marker={
						selectedParam === null
							? MyMarker.DetailNodesMarker
							: MyMarker.ValueMarker
					}
					data={displayedData || []}
				/>

				<VStack flex="3 1 0" align="start" p={baseLgStyle('xs', '2')} mt={baseLgStyle('4', '0')}>
					<HStack>
						<CompanyIcon type={type} />
						<Heading
							size="md"
							fontWeight="600"
							children={dashboardName}
						/>
					</HStack>
					<HStack flexWrap="wrap" mt="2">
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
							<ButtonGroup
								colorScheme="teal"
								isAttached
								size="sm"
								variant="outline"
								flexWrap="wrap"
								mt="1"
								rowGap="2"
							>
								{airParamsData().map((e, i) => (
									<Button
										key={i}
										border="1px solid"
										borderColor="teal.400"
										sx={
											selectedParam == i
												? {
														bg: 'teal.500',
														color: 'white',
														_hover: { bg: 'teal.600' },
												  }
												: {}
										}
										onClick={() =>
											setSelectedParam((e) => (e != i ? i : null))
										}
										children={e.name}
									/>
								))}
							</ButtonGroup>
						</Box>
					) : (
						<Alert fontSize="md" status="warning" rounded="md">
							<Text>
								Tidak ada node yang dapat dianalisis.
								<br />
								Tambahkan node untuk memulai memantau kualitas udara
							</Text>
						</Alert>
					)}

					<HStack justify="end" flexWrap="wrap-reverse" w="full" mt="2">
						{roleIsNot('regular') && (
							<ChangeActiveDashboard
								colorScheme="blue"
								flex='0 0 175px'
								// w={{base : "full", sm : 'auto'}}
								selectCompanyOnly={roleIsNot(['admin', 'gov'])}
								children="Ganti Dashboard"
							/>
						)}

						{roleIs(['admin', 'gov']) && type == 'regular' && (
							<Button
								colorScheme="blue"
								flex='0 0 175px'

								// w={{base : "full", sm : 'auto'}}
								onClick={() => navigate(`/users/${userId}`)}
							>
								Detail Pengguna
							</Button>
						)}

						{!!companyId && (
							<Button
								colorScheme="blue"
								// w={{base : "full", sm : 'auto'}}
								onClick={() => navigate(`/companies/${companyId}`)}
							>
								Detail Perusahaan
							</Button>
						)}
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
}
