import { TagNodeStatus } from '@/components/Tags/index.tags';
import { toFormatedDate } from '@/utils/dateFormating';
import { Button, HStack, IconButton } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconTrash } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

const nodeSubsColumnHelper = createColumnHelper<DTSubscribedNodes>();
const privateNodeColumnHelper = createColumnHelper<DTPrivateNodes>();

export const getSubscribedNodesColumns = (
	role: string,
	handleRemoveUserSubs: (id: number) => any
) => [
	nodeSubsColumnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
	}),
	nodeSubsColumnHelper.accessor('isUptodate', {
		header: 'Status',
		cell: (info) => <TagNodeStatus value={info.getValue()} />,
	}),

	nodeSubsColumnHelper.accessor('joinedAt', {
		header: 'Bergabung Pada',
		cell: (info) => toFormatedDate(info.getValue()),
	}),

	nodeSubsColumnHelper.accessor('subscriptionId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				{role !== 'gov' && (
					<IconButton
						colorScheme="red"
						size="sm"
						icon={<IconTrash size="16" />}
						aria-label="Hapus Node"
						onClick={() => handleRemoveUserSubs(info.getValue())}
					/>
				)}
				<Link to={'/nodes/' + info.row.original.nodeId}>
					<Button
						colorScheme="blue"
						size="sm"
						leftIcon={<IconExternalLink size="16" />}
						aria-label="Lihat Node"
						children="Lihat Node"
					/>
				</Link>
			</HStack>
		),
	}),
];

export const getPrivateNodesColumns = () => [
	privateNodeColumnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
	}),
	privateNodeColumnHelper.accessor('isUptodate', {
		header: 'Status',
		cell: (info) => <TagNodeStatus value={info.getValue()} />,
	}),

	privateNodeColumnHelper.accessor('createdAt', {
		header: 'Dibuat Pada',
		cell: (info) => toFormatedDate(info.getValue()),
	}),

	privateNodeColumnHelper.display({
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<Link to={'/nodes/' + info.row.original.nodeId}>
					<Button
						colorScheme="blue"
						size="sm"
						leftIcon={<IconExternalLink size="16" />}
						aria-label="Lihat Node"
						children="Lihat Node"
					/>
				</Link>
			</HStack>
		),
	}),
];
