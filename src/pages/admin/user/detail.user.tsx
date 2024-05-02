import { API_URL } from '@/config';
import { capitalizeString, fetcher } from '@/utils/index.utils';
import { Avatar, Box, Container, Divider, HStack, Heading, Tag, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, Center, Spacer, useDisclosure, Link} from '@chakra-ui/react';
import {
	IconAddressBook,
	IconAlertTriangle,
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
import EditUserModal from './editModal.user';
import EditPasswordModal from './editPassModal.user';
import SectionTitle from '@/components/common/sectionTitle';
import {Link as RLink} from 'react-router-dom'

const statusColor: { [key: string]: string } = {
	approved: 'blue',
	pending: 'orange',
	rejected: 'red',
};

export default function DetailUser() {
	let { id } = useParams();

	const {
		isOpen: editUserIsOpen,
		onOpen: editUserOnOpen,
		onClose: editUserOnClose,
	} = useDisclosure();

	const {
		isOpen: editPassIsOpen,
		onOpen: editPassOnOpen,
		onClose: editPassOnClose,
	} = useDisclosure();

	const {
		data: rawData,
		isLoading,
		error,
		mutate,
	} = useSWR(API_URL + '/users/' + id, fetcher);

	const data = rawData?.result;

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
						onClick={editUserOnOpen}
						variant="outline"
						colorScheme="blue"
						alignSelf="start"
						size="sm"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Profil'}
					/>
				</HStack>
				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi pengguna
				</SectionTitle>
				{data.description ? (
					<Text>{data.description}</Text>
				) : (
					<Text fontStyle="italic" color="gray.500">
						(Tidak Ada Deskripsi pengguna)
					</Text>
				)}
				<SectionTitle IconEl={IconUsersGroup}>
					Grup yang diikuti
				</SectionTitle>

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
												<RLink to={'../groups/'+ id}>

												<Button size="xs" colorScheme="blue">
													Lihat Grup
												</Button>
												</RLink>
											)}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
				<SectionTitle IconEl={IconLock}>Autentikasi</SectionTitle>

				<HStack justify="space-between">
					<Button colorScheme="yellow" size="sm" onClick={editPassOnOpen}>
						Ganti Kata Sandi
					</Button>
					<Button colorScheme="red" size="sm" onClick={editPassOnOpen}>
						Hapus Akun
					</Button>
				</HStack>
			</Container>
			<EditUserModal
				mutate={mutate}
				data={data}
				onClose={editUserOnClose}
				isOpen={editUserIsOpen}
			/>
			<EditPasswordModal
				data={data}
				onClose={editPassOnClose}
				isOpen={editPassIsOpen}
			/>
		</>
	);
}
