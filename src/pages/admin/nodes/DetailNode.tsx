import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { pageDataFetcher } from '@/utils/fetcher';
import { Container, HStack, Heading, Text, Button, Center, Flex, Stat, StatLabel, StatNumber, Box} from '@chakra-ui/react'; //prettier-ignore
import { IconCalendar, IconCircleDot, IconEdit, IconKey, IconRepeat, IconTallymarks, IconTextCaption} from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditNodeProfileButton from './EditNodeProfile';
import NodePosisionInMap from './nodemap.node';
import InputPassword from '@/components/form/inputPassword';
import SectionTitle from '@/components/common/SectionTitle';
import TagWithIcon from '@/components/common/TagWithIcon';
import UserSubsctiptionsList from './DTUserSubsctiptions';
import UserCard from '@/components/managerCard';
import { TagNodeType } from '@/components/tags/index.tags';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

export default function DetailNode() {
	let { id } = useParams();

	const { data, isLoading, error, mutate } = useSWR<NodeDataPage>(
		`/nodes/${id}`,
		pageDataFetcher
	);

	if (!data) return <LoadingAnimation />;


	return (
		<Box style={{ paddingBottom: '1000px' }}>
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center
						boxSize="30px"
						boxShadow="xs"
						bg="gray.100"
						rounded="md"
						p="1"
					>
						<IconCircleDot />
					</Center>
					<Heading fontSize="xl" fontWeight="600">
						Detail Node
					</Heading>
				</HStack>
			</HStack>
			<Container mt="8" maxW="container.md">
				<HStack spacing="4" justify="space-between">
					<Box>
						<Heading fontSize="3xl" children={data.name} />
						<HStack mt="2">
							<TagNodeType isPrivate={Boolean(data.ownerId)} />
							{!!data.instalationDate && (
								<TagWithIcon
									icon={IconCalendar}
									colorScheme="orange"
									children={`Node dipasang pada ${toFormatedDate(
										data.instalationDate
									)}`}
								/>
							)}
						</HStack>
						{data.owner && (
							<UserCard mt="3" data={data.owner} label="pemilik" />
						)}
					</Box>

					<EditNodeProfileButton
						data={data}
						mutate={mutate}
						colorScheme="blue"
						alignSelf="start"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Profil'}
					/>
				</HStack>

				<SectionTitle IconEl={IconTextCaption}>Deskripsi Node</SectionTitle>
				<Text>{data.description}</Text>

				<NodePosisionInMap data={data} mutate={mutate} />

				<UserSubsctiptionsList data={data} mutate={mutate}  />

				<SectionTitle IconEl={IconTallymarks}>Keterangan</SectionTitle>
				<Flex mt="3" gap="4" flexWrap="wrap">
					<Stat bg="teal.100" p="4" rounded="md" shadow="xs">
						<StatLabel>Status</StatLabel>
						<StatNumber
							textTransform="capitalize"
							children={data.status}
						/>
					</Stat>

					<Stat p="4" rounded="md" shadow="xs" bg="orange.100">
						<StatLabel>Terakhir Data Dikirim</StatLabel>
						<StatNumber
							textTransform="capitalize"
							children={toFormatedDatetime(data.lastDataSent)}
						/>
					</Stat>
				</Flex>
				<SectionTitle IconEl={IconKey}>API Key</SectionTitle>
				<Text fontSize="sm">
					Kode rahasia yang untuk kepentingan pengirimkan data dari sensor
					ke Node ini
				</Text>
				<HStack mt="3">
					<InputPassword bg="white" value={data.apiKey} />
					<Button
						leftIcon={<IconRepeat size="18" />}
						px="6"
						colorScheme="red"
					>
						Reset API Key
					</Button>
				</HStack>
			</Container>
		</Box>
	);
}
