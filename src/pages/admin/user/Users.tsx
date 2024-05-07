import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Spacer, Button, Avatar, Text, Flex, Link} from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconPlus, IconUser} from '@tabler/icons-react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { API_URL } from '@/constants/config';
import { Link as RLink } from 'react-router-dom';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import { toFormatedDate } from '@/utils/index.utils';
import InputSearch from '@/components/form/inputSearch';

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
			<RLink to={'/users/' + info.getValue()}>
				<Button
					colorScheme="blue"
					size="xs"
					leftIcon={<IconExternalLink size="16" />}
				>
					Detail
				</Button>
			</RLink>
		),
	}),
];

export default function UserManagement() {
	return (
		<Flex gap="4" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HeadingWithIcon Icon={<IconUser />} text="Daftar Pengguna" />

				<Spacer />
				<InputSearch
					w="200px"
					bg="white"
					placeholder="Cari .."
					_onSubmit={null}
				/>
				<RLink to="./create">
					<Button
						leftIcon={<IconPlus size="20px" />}
						colorScheme="green"
						children="Tambah Pengguna"
					/>
				</RLink>
			</HStack>
			<DataTable
				flexGrow="1"
				apiUrl={API_URL + '/users'}
				columns={userscolumns}
			/>
		</Flex>
	);
}
