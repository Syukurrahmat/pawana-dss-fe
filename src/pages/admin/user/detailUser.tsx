import { API_URL } from '@/config';
import { capitalizeString, fetcher } from '@/utils/index.utils';
import {
	Avatar,
	Box,
	Container,
	Divider,
	HStack,
	Heading,
	Tag,
	Text,
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	Button,
	Center,
	Spacer,
	useDisclosure,
	Link,
} from '@chakra-ui/react';
import {
	IconAddressBook,
	IconAuth2fa,
	IconEdit,
	IconLock,
	IconMail,
	IconPhone,
	IconTextCaption,
	IconUserBolt,
	IconUsersGroup,
} from '@tabler/icons-react';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditUserModal from './editUser';

const statusColor: { [key: string]: string } = {
	approved: 'blue',
	pending: 'orange',
	rejected: 'red',
};

export default function DetailUser() {
	let { id } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		data: dt,
		isLoading,
		error,
		mutate
	} = useSWR(API_URL + '/users/' + id, fetcher);

	const data = dt?.result;

	if (!data) return '';

	return (
		<>
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center
						boxSize="30px"
						boxShadow="xs"
						bg="gray.100"
						rounded="md"
						p="1"
					>
						<IconUserBolt />
					</Center>
					<Heading fontSize="xl" fontWeight="600">
						Detail Akun
					</Heading>
				</HStack>
			</HStack>
			<Container mt="8" maxW="container.md">
				<HStack spacing="6">
					<Avatar rounded="md" size="2xl" name={data.name} />
					<Box>
						<Tag
							colorScheme={data.isVerified ? 'green' : 'red'}
							size="sm"
						>
							{data.isVerified ? 'Terverifikasi' : 'Belum diverifikasi'}
						</Tag>
						<Heading mb="1" fontSize="2xl">
							{data.name}
						</Heading>
						<HStack>
							<IconMail size="16" />
							<Link href={'mailto:' + data.email}>
								<Text>{data.email}</Text>
							</Link>
						</HStack>
						<HStack>
							<IconPhone size="16" />
							<Link href={'tel:' + data.phone}>
								<Text>{data.phone}</Text>
							</Link>
						</HStack>
					</Box>
					<Spacer />
					<Button
						onClick={onOpen}
						variant="outline"
						colorScheme="blue"
						alignSelf="start"
						size="sm"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Profil'}
					/>
				</HStack>
				<Box mt="8">
					<HStack>
						<IconAddressBook size="18" />
						<Heading fontSize="lg" fontWeight="600">
							Alamat
						</Heading>
					</HStack>
					<Divider my="2" borderColor="gray.300" />
					<Text>{data.address}</Text>
				</Box>
				<Box mt="8">
					<HStack>
						<IconTextCaption size="18" />
						<Heading fontSize="lg" fontWeight="600">
							Deskripsi pengguna
						</Heading>
					</HStack>
					<Divider my="2" borderColor="gray.300" />
					{data.description ? (
						<Text>{data.description}</Text>
					) : (
						<Text fontStyle="italic" color="gray.500">
							(Tidak Ada Deskripsi pengguna)
						</Text>
					)}
				</Box>
				<Box mt="8">
					<HStack>
						<IconUsersGroup size="18" />
						<Heading fontSize="lg" fontWeight="600">
							Grup yang diikuti
						</Heading>
					</HStack>
					<Divider my="2" borderColor="gray.300" />
				</Box>
				<TableContainer shadow="xs" rounded="md" mt="4">
					<Table variant="striped" size="md">
						<Thead>
							<Tr>
								<Th>Nama Group</Th>
								<Th>Peran</Th>
								<Th>Status</Th>
								<Th>Bergabung pada</Th>
								<Th>Aksi</Th>
							</Tr>
						</Thead>
						<Tbody>
							{data.groups.map((e: any, i: any) => (
								<Tr key={i}>
									<Td>{e.name}</Td>
									<Td>
										<Tag
											colorScheme={
												e.permission == 'member' ? 'green' : 'blue'
											}
											children={capitalizeString(e.permission)}
										/>
									</Td>
									<Td>
										<Tag
											colorScheme={
												statusColor[e.requestStatus] || 'red'
											}
											children={capitalizeString(e.requestStatus)}
										/>
									</Td>
									<Td>
										{e.requestStatus == 'approved'
											? moment(e.joinedAt).format('DD MMM YYYY')
											: ''}
									</Td>
									<Td>
										<HStack>
											<Button size="xs" colorScheme="red">
												Hapus
											</Button>
											{e.requestStatus == 'approved' && (
												<Button size="xs" colorScheme="blue">
													Lihat Grup
												</Button>
											)}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
				<Box mt="8">
					<HStack>
						<IconLock size="18" />
						<Heading fontSize="lg" fontWeight="600">
							Autentikasi
						</Heading>
					</HStack>
					<Divider my="2" borderColor="gray.300" />
					<Button colorScheme="red">Ganti Kata Sandi</Button>
				</Box>
			</Container>
			<EditUserModal mutate={mutate} data={data} onClose={onClose} isOpen={isOpen} />
		</>
	);
}
