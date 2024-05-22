import { toFormatedDate } from '@/utils/dateFormating';
import { HStack, Tag, Button, Link} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconExternalLink, IconTrash, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import SectionTitle from '@/components/common/SectionTitle';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import { KeyedMutator } from 'swr';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import axios from 'axios';
import { API_URL } from '@/constants/config';

const columnHelper = createColumnHelper<DTNodeUsersSubscription>();

interface UserSubsList {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function UserSubsctiptionsList({ data, mutate }: UserSubsList) {
	let { nodeId, countUserSubscription } = data;
	const confirmDialog = useConfirmDialog();

	const deleteUserSubscription = (userId: number) => {
		confirmDialog({
			title: 'Hapus Pengguna',
			message: 'Hapus pengguna dari daftar pelanggan node ' + data.name,
			confirmButtonColor: 'red',
			onConfirm: () => null,
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

			columnHelper.accessor('UsersSubscriptions.createdAt', {
				header: 'Berlangganan sejak',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),

			columnHelper.accessor('userId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<Button
							size="sm"
							colorScheme="red"
							leftIcon={<IconTrash size="16" />}
							children="Hapus"
							onClick={() => deleteUserSubscription(info.getValue())}
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
				Daftar Pengguna yang berlangganan
				<Tag colorScheme="blue" ml="2">
					{countUserSubscription || 0}
				</Tag>
			</SectionTitle>

			<HStack mt="4" justify="space-between">
				<Button colorScheme="red" leftIcon={<IconTrash size="18" />}>
					Hapus Semua Pengguna
				</Button>
				<InputSearch
					rounded="md"
					bg="white"
					placeholder="Cari Pengguna"
					_onSubmit={null}
				/>
			</HStack>

			<DataTable
				mt="4"
				apiUrl={`/nodes/${nodeId}/usersubscriptions`}
				columns={columns}
				emptyMsg={['Belum ada Pengguna']}
			/>
		</>
	);
}
