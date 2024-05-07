import { HStack, Center, Spacer, Input, Button, Tag, Avatar, Text, Flex, Box, Link} from '@chakra-ui/react'; //prettier-ignore
import { IconBrandGoogleMaps, IconCircleDot, IconExternalLink, IconPlus} from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import HeadingWithIcon from '@/components/common/headingWithIcon';
import { useNavigate, Link as RLink } from 'react-router-dom';
import DataTable from '@/components/DataTable';
import { API_URL } from '@/constants/config';
import { useState } from 'react';
import moment from 'moment';
import { buildMapURL, toFormatedDate } from '@/utils/index.utils';
import InputSearch from '@/components/form/inputSearch';

const columnHelper = createColumnHelper<NodeData>();

const columns = [
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
			<Tag colorScheme={info.getValue() == 'indoor' ? 'blue' : 'green'}>
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
					variant="outline"
					leftIcon={<IconBrandGoogleMaps size="18" />}
				>
					Google map
				</Button>
			</Link>
		),
	}),
	columnHelper.accessor('lastDataSent', {
		header: 'Terakhir data dikirim',
		cell: (info) =>
			info.getValue()
				? toFormatedDate(info.getValue() || '')
				: 'Belum mengirim data',
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
];

export default function NodeManagement() {
	const navigate = useNavigate();

	return (
		<Flex gap="4" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HeadingWithIcon Icon={<IconCircleDot />} text="Daftar Node" />
				<Spacer />
				<InputSearch
					w="200px"
					bg="white"
					placeholder="Cari .."
					_onSubmit={null}
				/>
				<RLink to="./create">
					<Button
						leftIcon={<IconPlus size="20px" />}
						colorScheme="green"
						children="Tambah Node"
					/>
				</RLink>
			</HStack>

			<DataTable
				flexGrow="1"
				apiUrl={API_URL + '/nodes'}
				columns={columns}
			/>
		</Flex>
	);
}
