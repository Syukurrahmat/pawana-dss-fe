import { API_URL } from '@/constants/config';
import { toFormatedDate } from '@/utils/index.utils';
import { HStack, Tag, Button, useDisclosure, Avatar, Text} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconOutbound} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink, useParams } from 'react-router-dom';
import AddUserModal from '../addUserModal.group';
import { useMemo } from 'react';
import { useAlertDialog } from '@/layout';

const columnHelper = createColumnHelper<userOfGroupData>();

export default function MembersDetail() {
	const alertDialog = useAlertDialog();

	let { id } = useParams();
	const {
		isOpen: addUserIsOpen,
		onOpen: addUserOnOpen,
		onClose: addUserOnClose,
	} = useDisclosure();

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => (
					<RLink to={'/users/' + info.row.original.userId}>
						<HStack spacing="4">
							<Avatar name={info.getValue()} size="sm" />
							<Text>{info.getValue()}</Text>
						</HStack>
					</RLink>
				),
				meta: { sortable: true },
			}),
			columnHelper.accessor('GroupPermissions.permission', {
				header: 'Izin',
				cell: (info) => <Tag>{info.getValue()}</Tag>,
			}),
			columnHelper.accessor('GroupPermissions.joinedAt', {
				header: 'Bergabung pada',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),
			columnHelper.accessor('userId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<Button
							colorScheme="red"
							size="xs"
							leftIcon={<IconOutbound size="16" />}
							onClick={() => {
								alertDialog({
									title: 'Keluarkan Pengguna',
									message: `Anda yakin hendak mengeluarkan "${info.row.original.name}"`,
									onConfirm: () => {
										alert('dkdkdkdk');
									},
								});
							}}
						>
							Keluarkan
						</Button>
					</HStack>
				),
			}),
		],
		[]
	);

	return (
		<>
			<HStack mt="4" justify="space-between">
				<Button
					colorScheme="blue"
					leftIcon={<IconCirclePlus size="18" />}
					onClick={addUserOnOpen}
				>
					Tambahkan Pelanggan
				</Button>
				<InputSearch
					rounded="md"
					size="md"
					bg="white"
					placeholder="Cari Pelanggan"
					_onSubmit={null}
				/>
			</HStack>
			<DataTable
				maxH="400px"
				mt="4"
				apiUrl={API_URL + '/groups/' + id + '/users?status=approved'}
				columns={columns}
				emptyMsg={['Belum ada Pelanggan', 'Tambahkan Pelanggan sekarang']}
			/>
			<AddUserModal onClose={addUserOnClose} isOpen={addUserIsOpen} />
		</>
	);
}
