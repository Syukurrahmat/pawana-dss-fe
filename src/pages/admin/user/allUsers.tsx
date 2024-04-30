import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Center, Heading, Spacer, Input, Button, Tag, Avatar, Text, IconButton, Flex, Link} from '@chakra-ui/react'; //prettier-ignore
import { IconEdit, IconExternalLink, IconPlus, IconTrash, IconUser} from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import DataTable from '@/components/DataTable';
import { API_URL } from '@/config';
import { useNavigate, Link as RLink } from 'react-router-dom';

const columnHelper = createColumnHelper<UserData>();
const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<HStack spacing="4">
				<Avatar name={info.getValue()} size="sm" />
				<Text>{info.getValue()}</Text>
			</HStack>
		),
		meta: { sortable: true },
	}),
	columnHelper.accessor('email', {
		header: 'Surel',
		cell: (info) => (
			<Link href={'mailto:' + info.getValue()}>{info.getValue()}</Link>
		),
	}),
	columnHelper.accessor('phone', {
		header: 'Telepon',
		cell: (info) => (
			<Link href={'tel:+62' + info.getValue()}>{info.getValue()}</Link>
		),
	}),
	columnHelper.accessor('createdAt', {
		header: 'Dibuat pada',
		cell: (info) => moment(info.getValue()).format('DD MMM YYYY'),
		meta: { sortable: true },
	}),
	columnHelper.accessor('userId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<RLink to={'/users/' + info.getValue()}>
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
		meta: { sortable: true },
	}),
];

export default function UserManagement() {
	const navigate = useNavigate();

	return (
		<Flex gap="4" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center
						boxSize="30px"
						boxShadow="xs"
						bg="gray.100"
						rounded="md"
						p="1"
					>
						<IconUser />
					</Center>
					<Heading fontSize="xl" fontWeight="600">
						Daftar Pengguna
					</Heading>
				</HStack>
				<Spacer />
				<Input type="text" w="200px" bg="white" placeholder="Cari .." />
				<Button
					onClick={() => navigate('create')}
					leftIcon={<IconPlus size="20px" />}
					colorScheme="green"
				>
					Tambah Pengguna
				</Button>
			</HStack>
			<DataTable
				flexGrow="1"
				apiUrl={API_URL + '/users'}
				columns={columns}
			/>
		</Flex>
	);
}
