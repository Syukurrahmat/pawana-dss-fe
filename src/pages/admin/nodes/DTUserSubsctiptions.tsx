import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import SectionTitle from '@/components/common/SectionTitle';
import { API_URL } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import { toFormatedDate } from '@/utils/dateFormating';
import { Button, HStack, IconButton, Link, Spacer, Tag } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconTrash, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table';
import axios from 'axios';
import { useMemo } from 'react';
import { Link as RLink } from 'react-router-dom';
import { KeyedMutator, mutate } from 'swr';

const columnHelper = createColumnHelper<DTNodeUsersSubscription>();

interface UserSubsList {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function UserSubsctiptionsList({
	data,
	mutate: dataPageMutate,
}: UserSubsList) {
	let { nodeId, countUserSubscription } = data;
	const confirmDialog = useConfirmDialog();
	const { apiResponseToast } = useApiResponseToast();
	const dataApiURL = `/nodes/${nodeId}/users`;

	const handleDeleteSubs = (subscriptionid: number) => {
		confirmDialog({
			title: 'Hapus Pengguna',
			message: 'Hapus pengguna dari daftar pelanggan node ' + data.name,
			confirmButtonColor: 'red',
			onConfirm: async () => {
				return axios
					.delete(
						API_URL + dataApiURL + '?subscriptionid=' + subscriptionid
					)
					.then(({ data: dt }) =>
						apiResponseToast(dt, {
							onSuccess: () => {
								mutate((e) => e && e[0] == dataApiURL);
								dataPageMutate();
							},
						})
					);
			},
		});
	};
	const handleDeleteAllSubs = () => {
		confirmDialog({
			title: 'Hapus Semua Pengguna',
			message:
				'Hapus Semua pengguna dari daftar pelanggan node ' + data.name,
			confirmButtonColor: 'red',
			onConfirm: async () => {
				return axios
					.delete(API_URL + dataApiURL + '?all=true')
					.then(({ data: dt }) =>
						apiResponseToast(dt, {
							onSuccess: () => {
								mutate((e) => e && e[0] == dataApiURL);
								dataPageMutate();
							},
						})
					);
			},
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

			columnHelper.accessor('subscriptionId', {
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
						<RLink to={'/users/' + info.row.original.userId}>
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
				Daftar Pengguna yang mengikuti node ini
				<Tag colorScheme="blue" ml="2">
					{countUserSubscription || 0}
				</Tag>
			</SectionTitle>

			<HStack mt="4" justify="space-between">
				{!!countUserSubscription && (
					<Button
						colorScheme="red"
						leftIcon={<IconTrash size="18" />}
						onClick={handleDeleteAllSubs}
						children="Hapus Semua Pengguna"
					/>
				)}
				<Spacer/>
				<InputSearch
					rounded="md"
					bg="white"
					placeholder="Cari Pengguna"
					_onSubmit={null}
				/>
			</HStack>

			<DataTable
				mt="4"
				apiUrl={dataApiURL}
				columns={columns}
				emptyMsg={['Belum ada Pengguna']}
			/>
		</>
	);
}
