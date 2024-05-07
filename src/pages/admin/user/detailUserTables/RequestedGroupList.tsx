import { API_URL } from '@/constants/config';
import { toFormatedDate } from '@/utils/index.utils';
import { HStack, Tag, Button, useDisclosure, Spacer} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconExternalLink, IconTrash } from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import { Link as RLink } from 'react-router-dom';
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import AddGroupButton from './AddUserGroup';
import { useAlertDialog } from '@/components/common/myAlert';

import { useMemo } from 'react';

const statusColor: { [key: string]: string } = {
	approved: 'blue',
	pending: 'orange',
	rejected: 'red',
};
const columnHelper = createColumnHelper<groupOfUserData>();

export default function UserRequestedGroupList() {
	const { id } = useParams();
	const alertDialog = useAlertDialog();
	
	const apiUrl = API_URL + '/users/' + id + '/groups?not-approved=true';


	const column = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => info.getValue(),
				meta: { sortable: true },
			}),

			columnHelper.accessor('GroupPermissions.requestStatus', {
				header: 'Status',
				cell: (info) => (
					<Tag colorScheme={statusColor[info.getValue()] || 'red'}>
						{info.getValue()}
					</Tag>
				),
			}),

			columnHelper.accessor('GroupPermissions.requestJoinAt', {
				header: 'diminta pada',
				cell: (info) => toFormatedDate(info.getValue()),
			}),

			columnHelper.accessor('groupId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<Button
							colorScheme="red"
							size="xs"
							leftIcon={<IconTrash size="16" />}
							children="Batalkan"
							onClick={() => {
								alertDialog({
									title: 'Keluar dari Grup',
									message: `Yakin ingin keluar dari grup ${info.row.original.name}`,
									confirmButtonColor: 'red',
									confirmText: 'Keluar',
									onConfirm: () => {
										alert('xixixi');
									},
								});
							}}
						/>
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
					colorScheme="red"
					variant="outline"
					leftIcon={<IconTrash size="18" />}
				>
					Batalkan Semua
				</Button>
				<InputSearch
					rounded="md"
					bg="white"
					placeholder="Cari Grup"
					_onSubmit={null}
				/>
			</HStack>
			<DataTable
				maxH="400px"
				mt="4"
				apiUrl={apiUrl}
				columns={column}
				emptyMsg={['Belum ada Group', 'Tambahkan Group sekarang']}
			/>
		</>
	);
}
