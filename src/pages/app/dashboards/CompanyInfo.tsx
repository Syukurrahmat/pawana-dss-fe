import { Box, Button, Card, CardBody, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCalendar, IconCircleDot, IconTag } from '@tabler/icons-react'; // prettier-ignore
import CompanyIcon from '@/components/common/CompanyIcon';
import TagWithIcon from '@/components/common/TagWithIcon';
import { toFormatedDate } from '@/utils/dateFormating';
import { companyTypeAttr } from '@/constants/enumVariable';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MyMap from '@/components/maps/index.maps';
import { ValueMarker, NodesMarker } from '@/components/maps/Marker';

export default function CompanyInformation({ data }: ISPUDashboardData) {
	const { companyInfo, nodes } = data;
	const [selectedParam, setSelectedParam] = useState<null | number>(null);

	console.log(data)


	const airParams = [
		{
			html: 'ISPU',
			currentData: nodes.map((e) => {
				let { datetime, value } = e.ispu;
				return { ...e.node, data: { datetime, value: value[0].ispu } };
			}),
		},
		{
			html: 'PM2.5',
			currentData: nodes.map((e) => ({ ...e.node, data: e.pm25 })),
		},
		{
			html: 'PM10',
			currentData: nodes.map((e) => ({ ...e.node, data: e.pm100 })),
		},
		{
			html: 'CH4',
			currentData: nodes.map((e) => {
				let { datetime, value } = e.ch4;
				return { ...e.node, data: { datetime, value: value.value } };
			}),
		},
		{
			html: 'CO2',
			currentData: nodes.map((e) => {
				let { datetime, value } = e.co2;
				return { ...e.node, data: { datetime, value: value.value } };
			}),
		},
	];

	const displayedData =
		selectedParam !== null
			? airParams[selectedParam].currentData
			: nodes.map((e) => e.node);

	return (
		<Card size="sm" w="full">
			<CardBody as={Flex}>
				<MyMap
					markerType="displayNode"
					w="60%"
					h="275px"
					marker={selectedParam === null ? NodesMarker : ValueMarker}
					data={displayedData}
				/>

				<VStack align="start" p="6" flexGrow="1">
					<HStack>
						<CompanyIcon type={companyInfo.type} />
						<Heading
							size="md"
							fontWeight="600"
							children={companyInfo.name}
						/>
					</HStack>
					<HStack mt="2">
						<TagWithIcon
							icon={IconCalendar}
							colorScheme="blue"
							children={`Dibuat pada ${toFormatedDate(
								companyInfo.createdAt
							)}`}
						/>
						<TagWithIcon
							icon={IconTag}
							colorScheme={companyTypeAttr[companyInfo.type].color}
							textTransform="capitalize"
							children={companyInfo.type}
						/>
						<TagWithIcon
							icon={IconCircleDot}
							children={companyInfo.countNodes + ' Node'}
						/>
					</HStack>

					<Spacer />
					<Box>
						<Text>Tampilkan nilai dari parameter : </Text>
						<Flex flexWrap="wrap" gap="3" mt="1">
							{airParams.map((e, i) => (
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
									children={e.html}
								/>
							))}
						</Flex>
					</Box>
					<HStack justify="end" w="full" mt="4">
						<Button>Ganti Aktivitas</Button>
						<Link to={`/companies/${companyInfo.companyId}`}>
							<Button colorScheme="teal" ml="2">
								Detail Aktivitas
							</Button>
						</Link>
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
}
