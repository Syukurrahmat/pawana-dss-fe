import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Spacer, Input, Button, Avatar, Text, Flex, Link} from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconPlus, IconUser} from '@tabler/icons-react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { API_URL } from '@/constants/config';
import { useNavigate, Link as RLink } from 'react-router-dom';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import { toFormatedDate } from '@/utils/index.utils';

const columnHelper = createColumnHelper<UserData>();
export const userscolumns = [
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
		cell: (info) => toFormatedDate(info.getValue()),
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
	}),
];

export default function UserManagement() {
	const navigate = useNavigate();

	return (
		<Flex gap="4" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HeadingWithIcon Icon={<IconUser />} text="Daftar Pengguna" />

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
				columns={userscolumns}
			/>
		</Flex>
	);
}
