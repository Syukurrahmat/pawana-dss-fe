import opssImage from '@/assets/images/opss.png';

import NodeSubscription from '@/components/common/AddNodeSubscription';
import useUser from '@/hooks/useUser';
import { Box, Button, Card, CardBody, CardHeader, Center, Flex, HStack, Heading, Icon, Image, Stack, StackDivider, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconBuilding, IconCircleDot, IconCirclePlus, IconCircleX, IconTrees, IconZzz } from '@tabler/icons-react'; // prettier-ignore
import MultiNodeGRK from './GRK/MultiNodeGRK';
import SingleNodeGRK from './GRK/SingleNodeGRK';
import MultiNodeISPU from './ISPU/MultiNodeISPU';
import SingleNodeISPU from './ISPU/SingleNodeISPU';
import RecomendationSection from './RecomendationSection';
import { responsiveCardSize } from '@/utils/common.utils';

export type SingleISPU = SingleNodeAnalysisItem<ISPUValue>;
export type MutiISPU = NodeStat<ISPUValue>;
export type SingleGRK = SingleNodeAnalysisItem<GRKValue>;
export type MutiGRK = NodeStat<GRKValue>;
export type NodeGroupType = 'indoor' | 'outdoor' | 'arround';

interface ISPUCard {
	data: NodesGroup;
	type: NodeGroupType;
}



export default function NodesGroupInfo({ data: dt, type }: ISPUCard) {
	const { data, countNodes, analiysisDataType } = dt;

	const iconAndTitle = {
		indoor: {
			icon: IconBuilding,
			color: 'blue',
			title: 'Udara di perusahaan',
		},
		outdoor: {
			icon: IconTrees,
			color: 'green',
			title: 'Udara di sekitar perusahaan',
		},
		arround: {
			icon: IconTrees,
			color: 'green',
			title: 'Udara di sekitar',
		},
	};

	const isSingleNode = analiysisDataType == 'single';
	const countNonActiveNode = countNodes.all - countNodes.active;
	const { icon, color, title } = iconAndTitle[type];

	return (
		<Card size={responsiveCardSize}>
			<CardHeader pb="1">
				<HStack>
					<Center
						border="2px solid"
						borderColor={color + '.200'}
						color={color + '.500'}
						rounded="md"
						p="1"
						boxSize="45px"
						children={<Icon as={icon} boxSize="28px" />}
					/>
					<Box>
						<Heading size="md" fontWeight='600' children={title} />
						{!!data && (
							<HStack rowGap='1' color='dimmed'  columnGap='4' wrap='wrap'>
								<HStack >
									<Icon as={IconCircleDot} />
									<Text>
										{isSingleNode
											? (data as SingleNodeAnalysis).node.name
											: `Rerata dari ${countNodes.active} node`}
									</Text>
								</HStack>
								{!!countNonActiveNode && (
									<HStack  >
										<Icon as={IconCircleX} />
										<Text>{countNonActiveNode} Node Tidak Aktif</Text>
									</HStack>
								)}
							</HStack>
						)}
					</Box>
				</HStack>
			</CardHeader>

			<CardBody>
				{countNodes.active && data ? (
					<>
						<Stack
							divider={<StackDivider borderColor="gray.200" />}
							direction={{ base: 'column', lg: 'row' }}
							spacing='4'
						>
							{/* ISPU  */}

							<VStack flex="1 1 0px" align="start" spacing="4">
								{isSingleNode ? (
									<SingleNodeISPU data={data.ispu as SingleISPU} />
								) : (
									<MultiNodeISPU data={data.ispu as MutiISPU} />
								)}
							</VStack>

							{/* GRK  */}

							<VStack flex="1 1 0px" align="start" spacing="4">
								{isSingleNode ? (
									<SingleNodeGRK
										CO2data={data.co2 as SingleGRK}
										CH4data={data.ch4 as SingleGRK}
									/>
								) : (
									<MultiNodeGRK
										CH4data={data.ch4 as MutiGRK}
										CO2data={data.co2 as MutiGRK}
									/>
								)}
							</VStack>
						</Stack>

						<RecomendationSection
							type={type}
							isSingleNode={isSingleNode}
							data={data}
						/>
					</>
				) : (
					<NoDataDisplay data={dt} type={type} />
				)}
			</CardBody>
		</Card>
	);
}

function NoDataDisplay({ data, type }: ISPUCard) {
	const { all, active } = data.countNodes;
	const { user, roleIs } = useUser();

	const nonActiveCount = all - active;

	return (
		<Flex align="center" flexWrap="wrap" justify="center" px="3" py="6">
			<Image src={opssImage} h="140px" />
			<VStack align="start" spacing="1">
				{!all ? (
					<>
						<Heading size="md" mb="2">
							Belum Menambahkan Node {type == 'arround' ? '' : type}
						</Heading>

						{!roleIs('gov') && (
							<>
								{type == 'arround' ? (
									<NodeSubscription
										subsInfo={{
											type: 'user',
											userId: user.view?.user?.userId || user.userId,
										}}
									>
										<Button
											colorScheme="blue"
											leftIcon={<IconCirclePlus size="18" />}
											children="Tambahkan Node"
										/>
									</NodeSubscription>
								) : (
									<NodeSubscription
										subsInfo={{
											type: 'company',
											companyData: user.view?.company!,
										}}
									>
										<Button
											colorScheme="blue"
											leftIcon={<IconCirclePlus size="18" />}
											children="Tambahkan Node"
										/>
									</NodeSubscription>
								)}
							</>
						)}
					</>
				) : (
					<>
						<Heading size="md">Tidak dapat menampilkan data</Heading>
						<Text color="gray.500" fontStyle="italic">
							Tidak ada node yang aktif
						</Text>
						<HStack mt="3" spacing="4">
							<Center
								boxSize="40px"
								border="2px solid"
								borderColor={'orange.300'}
								p="2"
								rounded="md"
							>
								<Icon
									as={IconZzz}
									color={'orange.500'}
									boxSize="full"
								/>
							</Center>

							<Text fontWeight="600" fontSize="lg">
								{`Data pada ${nonActiveCount} node tidak mutakhir `}
							</Text>
						</HStack>
					</>
				)}
			</VStack>
		</Flex>
	);
}
