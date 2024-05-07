import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Center, Spacer, Input, Button, Tag, Avatar, Text, Flex, VStack} from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconPlus, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { API_URL } from '@/constants/config';
import { useNavigate, Link as RLink } from 'react-router-dom';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import { toFormatedDate } from '@/utils/index.utils';
import InputSearch from '@/components/form/inputSearch';

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
			<Text noOfLines={2} whiteSpace="wrap" children={info.getValue()} />
		),
	}),
	columnHelper.accessor((row) => [row.membersCount, row.memberRequestsCount], {
		header: 'Pelanggan',
		cell: (info) => (
			<VStack>
				<Tag colorScheme="green">{info.getValue()[0] + ' Pelanggan'}</Tag>
				{Boolean(info.getValue()[1]) && (
					<Tag colorScheme="orange">
						{info.getValue()[1] + ' Permintaan'}
					</Tag>
				)}
			</VStack>
		),
	}),
	columnHelper.accessor('nodeCount', {
		header: 'Node',
		cell: (info) => <Tag colorScheme="blue">{info.getValue() + ' Node'}</Tag>,
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
					children={'Belum Diatur'}
				/>
			),
	}),

	columnHelper.accessor('createdAt', {
		header: 'Dibuat pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),

	columnHelper.accessor('groupId', {
		header: 'Aksi',
		cell: (info) => (
			<RLink to={'/groups/' + info.getValue()}>
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

export default function GroupsManagement() {
	return (
		<Flex gap="4" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HeadingWithIcon Icon={<IconUsersGroup />} text="Daftar Grup" />
				<Spacer />

				<InputSearch
					_onSubmit={null}
					w="200px"
					bg="white"
					placeholder="Cari .."
				/>
				<RLink to="./create">
					<Button
						leftIcon={<IconPlus size="20px" />}
						colorScheme="green"
						children="Tambah Grup"
					/>
				</RLink>
			</HStack>

			<DataTable
				flexGrow="1"
				apiUrl={API_URL + '/groups'}
				columns={columns}
			/>
		</Flex>
	);
}
