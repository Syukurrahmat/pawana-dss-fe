import { Box, Button, Card, CardBody, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCalendar, IconCircleDot } from '@tabler/icons-react'; // prettier-ignore
import CompanyIcon from '@/components/common/CompanyIcon';
import TagWithIcon from '@/components/common/TagWithIcon';
import { toFormatedDate } from '@/utils/dateFormating';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MyMap from '@/components/Maps';
import { ValueMarker, NodesMarker } from '@/components/Maps/Marker';
import { TagCompanyType } from '@/components/Tags/index.tags';
import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';

export default function DashboardInfo({ data }: { data: DashboardDataType }) {
	const { dashboardInfo, nodes } = data;
	const { name, type, countNodes, companyId, createdAt } = dashboardInfo;
	const [selectedParam, setSelectedParam] = useState<null | number>(null);

	const airParamsData = [
		{
			name: 'ISPU',
			currentData: nodes.map((e) => {
				if (!e.data) return e;
				const { datetime, value } = e.data.ispu;

				return { ...e, data: { datetime, value: value[0].ispu } };
			}),
		},
		{
			name: 'PM2.5',
			currentData: nodes.map((e) => ({ ...e, data: e.data?.pm25 })),
		},
		{
			name: 'PM10',
			currentData: nodes.map((e) => ({ ...e, data: e.data?.pm100 })),
		},
		{
			name: 'CH4',
			currentData: nodes.map((e) => {
				if (!e.data) return e;
				const { datetime, value } = e.data.ch4;

				return { ...e, data: { datetime, value: value.value } };
			}),
		},
		{
			name: 'CO2',
			currentData: nodes.map((e) => {
				if (!e.data) return e;
				const { datetime, value } = e.data.co2;

				return { ...e, data: { datetime, value: value.value } };
			}),
		},
	];

	const displayedData =
		selectedParam !== null ? airParamsData[selectedParam].currentData : nodes;

	return (
		<Card size="sm" w="full">
			<CardBody as={Flex} gap="5">
				<MyMap
					w="60%"
					h="275px"
					companiesData={companyId ? [dashboardInfo] : []}
					marker={selectedParam === null ? NodesMarker : ValueMarker}
					data={displayedData}
				/>

				<VStack align="start" p="1" flexGrow="1">
					<HStack mt="6">
						<CompanyIcon type={type} />
						<Heading size="md" fontWeight="600" children={name} />
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
						<TagCompanyType value={type} />
						<TagWithIcon
							icon={IconCircleDot}
							children={countNodes + ' Node'}
						/>
					</HStack>

					<Spacer />
					<Box>
						<Text>Tampilkan nilai dari parameter : </Text>
						<Flex flexWrap="wrap" gap="3" mt="1">
							{airParamsData.map((e, i) => (
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
					<HStack justify="end" w="full" mt="4">
						<ChangeActiveDashboard colorScheme="blue">
							Ganti Dashboard
						</ChangeActiveDashboard>
						{!!companyId && (
							<Link to={`/companies/${companyId}`}>
								<Button colorScheme="blue" ml="2">
									Detail Usaha
								</Button>
							</Link>
						)}
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
}
