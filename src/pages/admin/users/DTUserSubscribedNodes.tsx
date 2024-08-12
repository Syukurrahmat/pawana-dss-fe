import DataTable from '@/components/DataTable';
import { getSubscribedNodesColumns } from '@/components/DataTable/commonColumn';
import MyMap from '@/components/Maps';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import useUser from '@/hooks/useUser';
import { usemyToasts } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import { Box, BoxProps, Skeleton } from '@chakra-ui/react'; //prettier-ignore
import { useMemo, useState } from 'react';
import { KeyedMutator, mutate } from 'swr';

interface UserSubsList extends BoxProps {
	data: Partial<UserDataPage>;
	mutate?: KeyedMutator<UserDataPage>;
}

export default function UserSubscribedNodesList({
	data,
	mutate: dataPageMutate,
	...rest
}: UserSubsList) {
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);

	const toast = usemyToasts();
	const confirmDialog = useConfirmDialog();
	const { user } = useUser();

	const apiURL = `/users/${data.userId}/nodes`;

	const handleRemoveUserSubscription = (subscriptionid: number) => {
		confirmDialog({
			title: 'Hapus Pengikuti Node',
			message: 'Anda yakin hendak menghapus node ini dari daftar langganan',
			confirmButtonColor: 'red',
			onConfirm: () =>
				myAxios
					.delete(`${apiURL}/${subscriptionid}`)
					.then(() => {
						toast.success('Node berhasil di-unsubcribe');
						mutate((e) => typeof e == 'string' && e.startsWith(apiURL));
						if (dataPageMutate) dataPageMutate();
					})
					.catch(() => {
						toast.success('Node berhasil di-unsubcribe');
					}),
		});
	};

	const columns = useMemo(
		() => getSubscribedNodesColumns(user.role, handleRemoveUserSubscription),
		[]
	);

	return (
		<Box {...rest}>
			<MyMap
				data={nodesDataCtx || []}
				as={nodesDataCtx == null ? Skeleton : undefined}
			/>

			<DataTable
				mt="4"
				apiUrl={apiURL}
				columns={columns}
				setDataContext={setNodeDataCtx}
				emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
				hiddenPagination={true}
			/>
		</Box>
	);
}
