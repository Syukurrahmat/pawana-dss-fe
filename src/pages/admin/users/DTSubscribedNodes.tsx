import { toFormatedDate } from '@/utils/dateFormating';
import { Box, HStack, Tag, Skeleton, IconButton, useToast} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconExternalLink, IconTrash, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import SectionTitle from '@/components/common/SectionTitle';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import AddSubscritionNode from './AddSubscritionNode';
import MyMap from '@/components/maps/index.maps';
import { mutate } from 'swr';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import { TagNodeStatus } from '@/components/tags/index.tags';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

const columnHelper = createColumnHelper<DTNodeOf<userSub>>();

export default function SubscribedNodesList({
	data,
	mutate: dataPageMutate,
}: DataAndMutateProp<UserDataPage>) {
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);
	const confirmDialog = useConfirmDialog();
	const { apiResponseToast } = useApiResponseToast();

	const dataTableApiURL = `/users/${data.userId}/nodes`;

	const handleRemoveUserSubscription = (subscriptionid: number) => {
		confirmDialog({
			title: 'Hapus Pengikuti Node',
			message:
				'Anda yakin hendak menghapus node ini dari daftar langganan Anda',
			confirmButtonColor: 'red',
			onConfirm: () =>
				axios
					.delete(
						`${API_URL}/users/${data.userId}/nodes?subscriptionid=${subscriptionid}`
					)
					.then(({ data: dt }) => {
						mutate((e) => e && e[0] == dataTableApiURL);
						dataPageMutate();
						apiResponseToast(dt);
					}),
		});
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => info.getValue(),
				meta: { sortable: true },
			}),
			columnHelper.accessor('status', {
				header: 'Status',
				cell: (info) => <TagNodeStatus status={info.getValue()} />,
				meta: { sortable: true },
			}),

			columnHelper.accessor('lastDataSent', {
				header: 'Terakhir data dikirim',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),

			columnHelper.accessor('UsersSubscriptions.createdAt', {
				header: 'Bergabung',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),

			columnHelper.accessor('UsersSubscriptions.usersSubscriptionId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<IconButton
							colorScheme="red"
							size="xs"
							icon={<IconTrash size="16" />}
							aria-label="Hapus Node"
							onClick={() =>
								handleRemoveUserSubscription(info.getValue())
							}
						/>
						<RLink to={'/nodes/' + info.getValue()}>
							<IconButton
								colorScheme="blue"
								size="xs"
								icon={<IconExternalLink size="16" />}
								aria-label="Lihat Node"
								children="Lihat Node"
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
				Node yang Anda Ikuti
				<Tag
					colorScheme="blue"
					ml="2"
					children={data.countSubscribedNodes || 0}
				/>
			</SectionTitle>

			<AddSubscritionNode
				colorScheme="blue"
				leftIcon={<IconCirclePlus size="18" />}
				children="Tambahkan Node"
			/>

			<Box mt="4">
				{nodesDataCtx == null ? (
					<Skeleton h="250px" />
				) : nodesDataCtx.length > 0 ? (
					<MyMap data={nodesDataCtx} />
				) : null}
			</Box>
			<DataTable
				mt="4"
				apiUrl={dataTableApiURL}
				columns={columns}
				setDataContext={setNodeDataCtx}
				emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
				hiddenPagination={true}
			/>
		</>
	);
}
