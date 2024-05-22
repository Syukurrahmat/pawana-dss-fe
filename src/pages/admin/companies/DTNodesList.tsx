import { Box, HStack, Tag, Button, Skeleton} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconExternalLink} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink, useParams } from 'react-router-dom';
import MyMap from '@/components/maps/index.maps';
import { useMemo, useState } from 'react';
import GMapsButton from '@/components/common/GMapsButton';
import { TagNodeStatus, TagNodeType } from '@/components/tags/index.tags';

const columnHelper = createColumnHelper<DTNodeOf<companySub>>();

interface NodeMapsAndNodesList {
	companyCoord: number[];
}

export default function NodeMapsAndNodesList({
	companyCoord,
}: NodeMapsAndNodesList) {
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);
	let { id } = useParams();

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
			}),

			columnHelper.accessor('ownerId', {
				header: 'Lokasi',
				cell: (info) => (
					<TagNodeType isPrivate={Boolean(info.getValue())} />
				),
			}),

			columnHelper.accessor('coordinate', {
				header: 'Koordinat',
				cell: (info) => <GMapsButton coordinate={info.getValue()} />,
			}),

			columnHelper.accessor('nodeId', {
				header: 'Aksi',
				cell: (info) => (
					<RLink to={'/nodes/' + info.getValue()}>
						<Button
							colorScheme="blue"
							size="xs"
							leftIcon={<IconExternalLink size="16" />}
						>
							Detail
						</Button>
					</RLink>
				),
			}),
		],
		[]
	);

	return (
		<>
			<HStack mt="4" justify="space-between">
				<Button colorScheme="blue" leftIcon={<IconCirclePlus size="18" />}>
					Tambahkan Node
				</Button>
				<InputSearch
					rounded="md"
					bg="white"
					placeholder="Cari Node"
					_onSubmit={null}
				/>
			</HStack>

			{(nodesDataCtx == null || nodesDataCtx.length > 0) && (
				<Box boxShadow="xs" mt="4" rounded="md" overflow="hidden">
					{nodesDataCtx == null ? (
						<Skeleton h="250px" />
					) : (
						<MyMap
							data={[
								...nodesDataCtx,
								{
									coordinate: companyCoord,
									isCompanyLocation: true,
								},
							]}
						/>
					)}
				</Box>
			)}

			<DataTable
				mt="4"
				apiUrl={`/companies/${id}/nodes`}
				columns={columns}
				setDataContext={setNodeDataCtx}
				emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
			/>
		</>
	);
}
