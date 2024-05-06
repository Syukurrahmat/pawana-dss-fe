import { API_URL } from '@/constants/config';
import { fetcher } from '@/utils/index.utils';
import { Container, HStack, Heading, Text, Button, Center, useDisclosure, Flex, Stat, StatLabel, StatNumber} from '@chakra-ui/react'; //prettier-ignore
import { IconCircleDot, IconEdit, IconKey, IconMapCheck, IconRepeat, IconTallymarks, IconTextCaption} from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import SectionTitle from '@/components/common/sectionTitle';
import EditNodeButton from './editModal.node';
import moment from 'moment';
import NodePosisionInMap from './nodemap.node';
import InputPassword from '@/components/form/inputPassword';

export default function DetailNode() {
	let { id } = useParams();
	const apiUrl = `${API_URL}/nodes/${id}`

	const {
		data: rawData,
		isLoading,
		error,
		mutate,
	} = useSWR(apiUrl, fetcher);

	const data = rawData?.result;
	if (!data) return '';

	return (
		<div style={{ paddingBottom: '1000px' }}>
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
					<Heading mb="1" fontSize="3xl">
						{data.name}
					</Heading>
					<EditNodeButton
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

				<SectionTitle IconEl={IconMapCheck}>Letak Node</SectionTitle>

				<NodePosisionInMap data={data} mutate={mutate} />

				<SectionTitle IconEl={IconTallymarks}>Keterangan</SectionTitle>
				<Flex mt="3" gap="4" flexWrap="wrap">
					<Stat bg="teal.100" p="4" rounded="md" shadow="xs">
						<StatLabel>Status</StatLabel>
						<StatNumber>NORMAL</StatNumber>
					</Stat>
					<Stat p="4" rounded="md" shadow="xs" bg="blue.100">
						<StatLabel>Letak</StatLabel>
						<StatNumber>OUTDOOR</StatNumber>
					</Stat>
					<Stat p="4" rounded="md" shadow="xs" bg="orange.100">
						<StatLabel>Terakhir Data Dikirim</StatLabel>
						<StatNumber>
							{moment(data.lastDataSent).format('HH MMM YYYY hh:mm')}
						</StatNumber>
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
		</div>
	);
}
