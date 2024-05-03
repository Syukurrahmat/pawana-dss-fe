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
	IconAlertTriangle,
	IconAuth2fa,
	IconCirclePlus,
	IconEdit,
	IconExternalLink,
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
import { Link as RLink } from 'react-router-dom';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import AddGroupModal from './addGroupModal.user';

const statusColor: { [key: string]: string } = {
	approved: 'blue',
	pending: 'orange',
	rejected: 'red',
};

const columnHelper = createColumnHelper<groupOfUserData>();

const column = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
		meta: { sortable: true },
	}),
	columnHelper.accessor('GroupPermissions.permission', {
		header: 'Peran',
		cell: (info) => (
			<Tag colorScheme={info.getValue() == 'manager' ? 'blue' : 'green'}>
				{info.getValue()}
			</Tag>
		),
	}),

	columnHelper.accessor('GroupPermissions.requestStatus', {
		header: 'Status',
		cell: (info) => (
			<Tag colorScheme={statusColor[info.getValue()] || 'red'}>
				{info.getValue()}
			</Tag>
		),
	}),
	columnHelper.accessor('GroupPermissions.joinedAt', {
		header: 'bergabung pada',
		cell: (info) => info.getValue() ? moment(info.getValue()).format('DD MMM YYYY') : "",
	}),

	columnHelper.accessor('groupId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<RLink to={'../groups/' + info.getValue()}>
					<Button
						colorScheme="blue"
						size="xs"
						leftIcon={<IconExternalLink size="16" />}
					>
						Detail
					</Button>
				</RLink>
			</HStack>
		),
	}),
];

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
		isOpen: addGroupIsOpen,
		onOpen: addGroupOnOpen,
		onClose: addGroupOnClose,
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
			<HeadingWithIcon Icon={<IconUserBolt />} text="Detail Akun" />
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
				<SectionTitle IconEl={IconUsersGroup}>
					Daftar Pelanggan
					<Tag colorScheme="blue" ml="2">
						{data.membersCount | 0}
					</Tag>
				</SectionTitle>
				<HStack mt="4" justify="space-between">
					<Button
						size="sm"
						colorScheme="blue"
						variant="outline"
						leftIcon={<IconCirclePlus size="18" />}
						onClick={addGroupOnOpen}
					>
						Tambahkan grup
					</Button>
					<InputSearch
						rounded="md"
						size="sm"
						bg="white"
						placeholder="Cari Grup"
					/>
				</HStack>
				<DataTable
					maxH="400px"
					mt="4"
					apiUrl={API_URL + '/users/' + id + '/groups'}
					columns={column}
					emptyMsg={[
						'Belum ada Group',
						'Tambahkan Group sekarang',
					]}
				/>
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
			<AddGroupModal
				data={data}
				onClose={addGroupOnClose}
				isOpen={addGroupIsOpen}
			/>

		</>
	);
}
