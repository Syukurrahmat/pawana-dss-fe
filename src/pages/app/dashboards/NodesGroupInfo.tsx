import opssImage from '@/assets/opss.png';
import { AddNodeCompanySubscription, AddNodeUserSubscription } from '@/components/common/AddNodeSubscription'; //prettier-ignore
import useUser from '@/hooks/useUser';
import { Alert, AlertDescription, AlertTitle, Box, Button, Card, CardBody, CardHeader, Center, HStack, Heading, Icon, Image, Stack, StackDivider, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconBuilding, IconCirclePlus, IconReceipt, IconTrees, IconZzz } from '@tabler/icons-react'; // prettier-ignore
import MultiNodeGRK from './GRK/MultiNodeGRK';
import SingleNodeGRK from './GRK/SingleNodeGRK';
import MultiNodeISPU from './ISPU/MultiNodeISPU';
import SingleNodeISPU from './ISPU/SingleNodeISPU';

type SingleISPU = SingleNodeAnalysisItem<[ISPUValue, ISPUValue]>;
type MutiISPU = NodeStat<ISPUValue[]>;
type SingleGRK = SingleNodeAnalysisItem<GRKCategorize>;
type MutiGRK = NodeStat<GRKCategorize>;
type NodeGroupType = 'indoor' | 'outdoor' | 'arround';

interface ISPUCard {
	data: DataNodeGroup;
	type: NodeGroupType;
}

const iconAndTitle = {
	indoor: {
		icon: IconBuilding,
		color: 'blue',
		title: 'Kualitas Udara Di dalam ruangan',
	},
	outdoor: {
		icon: IconTrees,
		color: 'green',
		title: 'Kualitas Udara Di sekitar usaha Anda',
	},
	arround: {
		icon: IconTrees,
		color: 'green',
		title: 'Kualitas Udara Di sekitar Anda',
	},
};

export default function NodesGroupInfo({ data: dt, type }: ISPUCard) {
	const { data, countNodes } = dt;
	const isSingleNode = countNodes.active === 1;

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
					<Heading size="md" children={title} />
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
								mt="1"
							/>

							<Box ml="3">
								<AlertTitle>Your browser is outdated!</AlertTitle>
								<AlertDescription>
									Your Chakra experience may be degraded.
								</AlertDescription>
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
							<Button
								as={AddNodeUserSubscription}
								userId={user.userId}
								countSubscribedNode={user.countSubscribedNodes}
								colorScheme="blue"
								leftIcon={<IconCirclePlus size="18" />}
								children="Tambahkan Node"
							/>
						) : (
							<Button
								as={AddNodeCompanySubscription}
								companyData={user.activeCompany as any}
								countSubscribedNode={3}
								colorScheme="blue"
								leftIcon={<IconCirclePlus size="18" />}
								children="Tambahkan Node"
							/>
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
								{`Data pada ${nonActiveCount} node Tidak Uptodate `}
							</Text>
						</HStack>
					</>
				)}
			</VStack>
		</HStack>
	);
}
