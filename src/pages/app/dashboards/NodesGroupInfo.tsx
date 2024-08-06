import opssImage from '@/assets/opss.png';

import NodeSubscription from '@/components/common/AddNodeSubscription';
import useUser from '@/hooks/useUser';
import { Alert, AlertTitle, Box, Button, Card, CardBody, CardHeader, Center, HStack, Heading, Icon, Image, Spacer, Stack, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconBuilding, IconCircleDot, IconCirclePlus, IconCircleX, IconReceipt, IconTrees, IconZzz } from '@tabler/icons-react'; // prettier-ignore
import MultiNodeGRK from './GRK/MultiNodeGRK';
import SingleNodeGRK from './GRK/SingleNodeGRK';
import MultiNodeISPU from './ISPU/MultiNodeISPU';
import SingleNodeISPU from './ISPU/SingleNodeISPU';

type SingleISPU = SingleNodeAnalysisItem<[ISPUValue, ISPUValue]>;
type MutiISPU = NodeStat<[ISPUValue, ISPUValue]>;
type SingleGRK = SingleNodeAnalysisItem<GRKCategorize>;
type MutiGRK = NodeStat<GRKCategorize>;
type NodeGroupType = 'indoor' | 'outdoor' | 'arround';

interface ISPUCard {
	data: NodesGroup;
	type: NodeGroupType;
}

const iconAndTitle = {
	indoor: {
		icon: IconBuilding,
		color: 'blue',
		title: 'Kualitas udara di perusahaan',
	},
	outdoor: {
		icon: IconTrees,
		color: 'green',
		title: 'Kualitas udara di sekitar perusahaan Anda',
	},
	arround: {
		icon: IconTrees,
		color: 'green',
		title: 'Kualitas udara di sekitar Anda',
	},
};

export default function NodesGroupInfo({ data: dt, type }: ISPUCard) {
	const { data, countNodes, analiysisDataType } = dt;

	const isSingleNode = analiysisDataType == 'single';
	const countNonActiveNode = countNodes.all - countNodes.active;
	const { icon, color, title } = iconAndTitle[type];

	return (
		<Card>
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
						<Heading size="md" children={title} />
						{!!data && (
							<HStack spacing="4">
								<HStack>
									<Icon as={IconCircleDot} />
									<Text>
										{isSingleNode
											? (data as SingleNodeAnalysis).node.name
											: `Rerata dari ${countNodes.active} sensor`}
									</Text>
								</HStack>
								{!!countNonActiveNode && (
									<HStack>
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
							direction="row"
							spacing="5"
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

						<Alert
							mt="6"
							status="info"
							variant="left-accent"
							rounded="md"
							alignItems="start"
						>
							<Icon
								as={IconReceipt}
								boxSize="7"
								color="blue.600"
								mt="2"
							/>

							<Box ml="3">
								{(() => {
									const recomendationIspu = isSingleNode
											? (data.ispu as SingleISPU).latestData.value[0].recomendation //prettier-ignore
											: (data.ispu as MutiISPU).average.data.value[0].recomendation //prettier-ignore

									const recomendationCH4 = isSingleNode
											? (data.ch4 as SingleGRK).latestData.value.recomendation //prettier-ignore
											: (data.ch4 as MutiGRK).average.data.value.recomendation //prettier-ignore

									const recomendationCO2 = isSingleNode
											? (data.co2 as SingleGRK).latestData.value.recomendation //prettier-ignore
											: (data.co2 as MutiGRK).average.data.value.recomendation //prettier-ignore

									const contents = [
										{ recomendation: recomendationIspu },
										{ recomendation: recomendationCO2 },
										{ recomendation: recomendationCH4 },
									];

									return (
										<Tabs variant="soft-rounded" colorScheme="gray">
											<TabList as={HStack}>
												<AlertTitle m="0">Rekomendasi</AlertTitle>
												<Spacer />
												<Tab rounded="lg">Kualitas Udara</Tab>
												<Tab rounded="lg">Emisi Karbondioksida</Tab>
												<Tab rounded="lg">Emisi Metana</Tab>
											</TabList>

											<TabPanels pb="2">
												{contents.map(({ recomendation }, i) => (
													<TabPanel
														px="0"
														py="2"
														key={i}
														as={VStack}
														align="start"
													>
														<Text
															textIndent="40px"
															fontSize="md"
															textAlign="justify"
														>
															{recomendation?.info}
														</Text>
														<Text
															fontSize="md"
															textAlign="justify"
														>
															<span
																style={{
																	fontWeight: 600,
																}}
															>
																Saran :{' '}
															</span>
															{type == 'indoor'
																? recomendation?.company
																: recomendation?.public}
														</Text>
													</TabPanel>
												))}
											</TabPanels>
										</Tabs>
									);
								})()}
							</Box>
						</Alert>
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
	const { user } = useUser();

	const nonActiveCount = all - active;

	return (
		<HStack justify="center" px="3" py="6">
			<Image src={opssImage} h="140px" />
			<VStack align="start" spacing="1">
				{!all ? (
					<>
						<Heading size="md" mb="2">
							Anda Belum Menambahkan Node {type == 'arround' ? '' : type}
						</Heading>

						{type == 'arround' ? (
							<NodeSubscription
								subsInfo={{
									type: 'user',
									userId: user.userId,
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
		</HStack>
	);
}
