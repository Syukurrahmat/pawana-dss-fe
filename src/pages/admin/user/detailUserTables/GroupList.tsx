import { toFormatedDate } from '@/utils/index.utils';
import { HStack, Tag, Button} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconExternalLink } from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import { Link as RLink } from 'react-router-dom';
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import AddGroupButton from './AddUserGroup';
import { useAlertDialog } from '@/components/common/myAlert';
import { useMemo, useState } from 'react';
import { API_URL } from '@/constants/config';
import axios from 'axios';

const statusColor: { [key: string]: string } = {
	approved: 'blue',
	pending: 'orange',
	rejected: 'red',
};
const columnHelper = createColumnHelper<groupOfUserData>();

export default function GroupListDetailUser({ data }: { data: any }) {
	const { id } = useParams();
	const alertDialog = useAlertDialog();
	// const [data, setData] = useState<any>(null);
	const [search, setSearch] = useState('');

	const column = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => info.getValue(),
				meta: { sortable: true },
			}),
			columnHelper.accessor('GroupPermissions.permission', {
				header: 'Peran',
				cell: (info) => (
					<Tag
						colorScheme={info.getValue() == 'manager' ? 'blue' : 'green'}
						children={info.getValue()}
					/>
				),
			}),

			columnHelper.accessor('GroupPermissions.joinedAt', {
				header: 'bergabung pada',
				cell: (info) => toFormatedDate(info.getValue()),
			}),

			columnHelper.accessor('groupId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<Button
							colorScheme="red"
							size="xs"
							leftIcon={<IconExternalLink size="16" />}
							children="Keluar"
							onClick={() => {
								alertDialog({
									title: 'Keluar dari Grup',
									message: `Yakin ingin keluar dari grup ${info.row.original.name}`,
									confirmButtonColor: 'red',
									confirmText: 'Keluar',
									onConfirm: () => {
										axios.delete(`${API_URL}/users/${id}/groups`, {
											data: { groupId: info.row.original.groupId },
										});
									},
								});
							}}
						/>
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
		],
		[]
	);

	return (
		<>
			<HStack mt="4" justify="space-between">
				<AddGroupButton
					size="md"
					data={data}
					colorScheme="blue"
					leftIcon={<IconCirclePlus size="18" />}
				>
					Tambahkan grup
				</AddGroupButton>
				<InputSearch
					rounded="md"
					size="md"
					bg="white"
					placeholder="Cari Grup"
					_onSubmit={setSearch}
				/>
			</HStack>
			<DataTable
				maxH="400px"
				mt="4"
				apiUrl={API_URL + '/users/' + id + '/groups'}
				columns={column}
				emptyMsg={['Belum ada Group', 'Tambahkan Group sekarang']}
				searchQuery={search}
			/>
		</>
	);
}
