import { API_URL } from '@/constants/config';
import { buildMapURL } from '@/utils/index.utils';
import { Box, HStack, Tag, Button, Link, Skeleton} from '@chakra-ui/react'; //prettier-ignore
import { IconBrandGoogleMaps, IconCirclePlus, IconExternalLink} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink, useParams } from 'react-router-dom';
import MyMap from '@/components/maps/index.maps';
import { useMemo, useState } from 'react';

const columnHelper = createColumnHelper<nodeOfGroupData>();

export default function NodeMapsAndNodesList() {
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
				cell: (info) => <Tag>{info.getValue()}</Tag>,
			}),

			columnHelper.accessor('environment', {
				header: 'Lokasi',
				cell: (info) => (
					<Tag
						colorScheme={info.getValue() == 'indoor' ? 'blue' : 'green'}
					>
						{info.getValue()}
					</Tag>
				),
			}),

			columnHelper.accessor((row) => [row.latitude, row.longitude], {
				header: 'Koordinat',
				cell: (info) => (
					<Link
						href={buildMapURL(info.getValue()[0], info.getValue()[1])}
						target={'_blank'}
					>
						<Button
							size="xs"
							colorScheme="blue"
							leftIcon={<IconBrandGoogleMaps size="18" />}
						>
							Google map
						</Button>
					</Link>
				),
			}),

			columnHelper.accessor('nodeId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<RLink to={'/nodes/' + info.getValue()}>
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
						<MyMap data={nodesDataCtx} />
					)}
				</Box>
			)}

			<DataTable
				mt="4"
				apiUrl={API_URL + '/groups/' + id + '/nodes'}
				columns={columns}
				setDataContext={setNodeDataCtx}
				emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
			/>
		</>
	);
}
