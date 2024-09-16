import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import SectionTitle from '@/components/common/SectionTitle';

import useConfirmDialog from '@/hooks/useConfirmDialog';
import { useMyToasts } from '@/utils/common.utils';
import { toFormatedDate } from '@/utils/dateFormating';
import { myAxios } from '@/utils/fetcher';
import { Button, HStack, IconButton, Link, Tag } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconTrash, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Link as RLink } from 'react-router-dom';
import { KeyedMutator, mutate } from 'swr';

const columnHelper = createColumnHelper<DTNodeUsersSubscription>();

interface UserSubsList {
	mutate: KeyedMutator<NodeDataPage>;
	data: NodeDataPage;
}

export default function UserSubsctiptionsList({
	data,
	mutate: dataPageMutate,
}: UserSubsList) {
	let { nodeId, countUserSubscription } = data;
	const confirmDialog = useConfirmDialog();
	const toast = useMyToasts();
	const apiURL = `/nodes/${nodeId}/users`;

	const handleDeleteSubs = (userId: number) => {
		confirmDialog({
			title: 'Hapus Pengguna',
			message: 'Hapus pengguna dari daftar pelanggan node ' + data.name,
			confirmButtonColor: 'red',
			onConfirm: async () =>
				myAxios
					.delete(`${apiURL}/${userId}`)
					.then(() => {
						mutate((e) => typeof e == 'string' && e.startsWith(apiURL));
						dataPageMutate();
						toast.success('Berhasil menghapus subscription pengguna');
					})
					.catch(() => {
						toast.error('Gagal menghapus subscription pengguna');
					}),
		});
	};
	 

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => <NameWithAvatar name={info.getValue()} />,
				meta: { sortable: true },
			}),

			columnHelper.accessor('phone', {
				header: 'Telepon',
				cell: (info) => (
					<Link href={'tel:+62' + info.getValue()}>{info.getValue()}</Link>
				),
			}),

			columnHelper.accessor('joinedAt', {
				header: 'Berlangganan sejak',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),

			columnHelper.accessor('userId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<IconButton
							size="sm"
							colorScheme="red"
							icon={<IconTrash size="16" />}
							aria-label="Hapus"
							onClick={() => handleDeleteSubs(info.getValue())}
						/>
						<RLink to={'/users/' + info.getValue()}>
							<Button
								colorScheme="blue"
								size="sm"
								leftIcon={<IconExternalLink size="16" />}
								children="Lihat Pengguna"
							/>
						</RLink>
					</HStack>
				),
			}),
		],
		[]
	);

	return (
		<>
			<SectionTitle IconEl={IconUsersGroup}>
				Daftar pengguna yang mensubscribe
				<Tag colorScheme="blue" ml="2">
					{countUserSubscription || 0}
				</Tag>
			</SectionTitle>

			{!!countUserSubscription && (
				<HStack mt="4" justify='end' >
					<InputSearch
						w="350px"
						rounded="md"
						bg="white"
						placeholder="Cari Pengguna"
						_onSubmit={null}
					/>
				</HStack>
			)}

			<DataTable
				mt="4"
				apiUrl={apiURL}
				columns={columns}
				emptyMsg={['Belum ada Pengguna']}
			/>
		</>
	);
}
