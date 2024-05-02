import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Center, Heading, Spacer, Input, Button, Tag, Avatar, Text, Flex} from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconPlus, IconUser} from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import DataTable from '@/components/DataTable';
import { API_URL } from '@/config';
import { useNavigate, Link as RLink } from 'react-router-dom';

const columnHelper = createColumnHelper<GroupData>();
const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
		meta: { sortable: true },
	}),

	columnHelper.accessor('address', {
		header: 'Alamat',
		cell: (info) => (
			<Text noOfLines={2} whiteSpace="wrap">
				{info.getValue()}
			</Text>
		),
	}),
	columnHelper.accessor('memberCount', {
		header: 'Pelanggan',
		cell: (info) => <Tag colorScheme="green">{info.getValue() + " Pelanggan"}</Tag>,
	}),
	columnHelper.accessor('nodeCount', {
		header: 'Node',
		cell: (info) => <Tag colorScheme="blue">{info.getValue() +  " Node"}</Tag>,
	}),
	columnHelper.accessor('manager', {
		header: 'Manager',
		cell: (info) =>
			info.getValue().name ? (
				<RLink to={'../users/' + info.getValue().userId}>
					<Button
						size="sm"
						py="5"
						variant="outline"
						w="full"
						justifyContent="left"
						leftIcon={<Avatar size="sm" name={info.getValue().name} />}
						children={info.getValue().name}
					/>
				</RLink>
			) : (
				<Center
					border="1px"
					borderColor="gray.200"
					fontWeight="500"
					fontSize="sm"
					rounded="md"
					p="2.5"
				>
					Belum Diatur
				</Center>
			),
	}),

	columnHelper.accessor('createdAt', {
		header: 'Dibuat pada',
		cell: (info) => moment(info.getValue()).format('DD MMM YYYY'),
		meta: { sortable: true },
	}),

	columnHelper.accessor('groupId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<RLink to={'/groups/' + info.getValue()}>
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
				apiUrl={API_URL + '/groups'}
				columns={columns}
			/>
		</Flex>
	);
}
