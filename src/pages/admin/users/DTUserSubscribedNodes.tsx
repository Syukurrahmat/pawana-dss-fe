import { Box, Skeleton, BoxProps} from '@chakra-ui/react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { useMemo, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import MyMap from '@/components/Maps';
import { KeyedMutator, mutate } from 'swr';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import { getSubscribedNodesColumns } from '@/components/DataTable/commonColumn';
import useUser from '@/hooks/useUser';

interface x extends BoxProps {
	data: Partial<UserDataPage>;
	mutate?: KeyedMutator<any>;
}

export default function UserSubscribedNodesList({
	data,
	mutate: dataPageMutate,
	...rest
}: x) {
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);
	const confirmDialog = useConfirmDialog();
	const { user } = useUser();
	const { apiResponseToast } = useApiResponseToast();

	const apiURL = `/users/${data.userId}/nodes`;

	const handleRemoveUserSubscription = (subscriptionid: number) => {
		const deleteURL = `${ API_URL + apiURL}?subscriptionid=${subscriptionid}`; //prettier-ignore

		confirmDialog({
			title: 'Hapus Pengikuti Node',
			message: 'Anda yakin hendak menghapus node ini dari daftar langganan',
			confirmButtonColor: 'red',
			onConfirm: () =>
				axios.delete(deleteURL).then(({ data: dt }) => {
					mutate((e: any) => e && e[0] == apiURL);
					if (dataPageMutate) dataPageMutate();
					apiResponseToast(dt);
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
