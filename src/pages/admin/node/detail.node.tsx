import { API_URL } from '@/config';
import { buildMapURL, fetcher, toFormatedDate } from '@/utils/index.utils';
import { Avatar, Box, Container, HStack, Heading, Tag, Text, Button, Center, useDisclosure, Link, TagLeftIcon, TagLabel, Skeleton} from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconBrandGoogleMaps, IconCircleDot, IconCirclePlus, IconEdit, IconExternalLink, IconTextCaption, IconUser, IconUserHeart, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import SectionTitle from '@/components/common/sectionTitle';
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink } from 'react-router-dom';
import MyMap from '@/components/maps/index.maps';
import { useState } from 'react';
import EditNodeModal from './editModal.node';

const usersColumnHelper = createColumnHelper<userOfGroupData>();
const nodesColumnHelper = createColumnHelper<nodeOfGroupData>();

const nodesColumns = [
	nodesColumnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
		meta: { sortable: true },
	}),
	nodesColumnHelper.accessor('status', {
		header: 'Status',
		cell: (info) => <Tag>{info.getValue()}</Tag>,
	}),

	nodesColumnHelper.accessor('environment', {
		header: 'Lokasi',
		cell: (info) => (
			<Tag colorScheme={info.getValue() == 'indoor' ? 'blue' : 'green'}>
				{info.getValue()}
			</Tag>
		),
	}),

	nodesColumnHelper.accessor(row=> [row.latitude, row.longitude], {
		header: 'Koordinat',
		cell: (info) => (
			<Link
				href={buildMapURL(
					info.getValue()[0],
					info.getValue()[1],
				)}
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

	nodesColumnHelper.accessor('nodeId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<RLink to={'/users/' + info.getValue()}>
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
];

const usersColumns = [
	usersColumnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<HStack spacing="4">
				<Avatar name={info.getValue()} size="sm" />
				<Text>{info.getValue()}</Text>
			</HStack>
		),
		meta: { sortable: true },
	}),
	usersColumnHelper.accessor('GroupPermissions.permission', {
		header: 'Izin',
		cell: (info) => <Tag>{info.getValue()}</Tag>,
	}),
	usersColumnHelper.accessor('GroupPermissions.joinedAt', {
		header: 'Bergabung pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),
	usersColumnHelper.accessor('userId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<RLink to={'/users/' + info.getValue()}>
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
];

export default function DetailNode() {
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);

	let { id } = useParams();

	const {
		isOpen: editUserIsOpen,
		onOpen: editUserOnOpen,
		onClose: editUserOnClose,
	} = useDisclosure();

	const {
		data: rawData,
		isLoading,
		error,
		mutate,
	} = useSWR(API_URL + '/groups/' + id, fetcher);

	const data = rawData?.result;

	if (!data) return '';

	return (
		<>
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center
						boxSize="30px"
						boxShadow="xs"
						bg="gray.100"
						rounded="md"
						p="1"
					>
						<IconUserHeart />
					</Center>
					<Heading fontSize="xl" fontWeight="600">
						Detail Grup
					</Heading>
				</HStack>
			</HStack>
			<Container mt="8" maxW="container.md">
				<HStack justify="space-between">
					<Box>
						<Heading mb="1" fontSize="3xl">
							{data.name}
						</Heading>
						<HStack mt="2">
							<Tag size="md" variant="subtle" colorScheme="green">
								<TagLeftIcon boxSize="16px" as={IconUser} />
								<TagLabel>{data.membersCount | 0} Pelanggan</TagLabel>
							</Tag>
							<Tag size="md" variant="subtle" colorScheme="blue">
								<TagLeftIcon boxSize="16px" as={IconCircleDot} />
								<TagLabel>{data.nodeCount | 0} Node</TagLabel>
							</Tag>
						</HStack>
					</Box>
					<Button
						onClick={editUserOnOpen}
						variant="outline"
						colorScheme="blue"
						alignSelf="start"
						size="sm"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Profil'}
					/>
				</HStack>

				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi Pabrik
				</SectionTitle>
				<Text>{data.description}</Text>

				<SectionTitle IconEl={IconCircleDot}>
					Daftar Node
					<Tag colorScheme="blue" ml="2">
						{data.nodeCount | 0}
					</Tag>
				</SectionTitle>
				<HStack mt="4" justify="space-between">
					<Button
						size="sm"
						colorScheme="blue"
						variant="outline"
						leftIcon={<IconCirclePlus size="18" />}
					>
						Tambahkan Node
					</Button>
					<InputSearch
						rounded="md"
						size="sm"
						bg="white"
						placeholder="Cari Node"
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
					columns={nodesColumns}
					setDataContext={setNodeDataCtx}
					emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
				/>

				<SectionTitle IconEl={IconUsersGroup}>
					Daftar Pelanggan
					<Tag colorScheme="blue" ml="2">
						{data.membersCount | 0}
					</Tag>
				</SectionTitle>
				<HStack mt="4" justify="space-between">
					<Button
						size="sm"
						colorScheme="blue"
						variant="outline"
						leftIcon={<IconCirclePlus size="18" />}
					>
						Tambahkan Pelanggan
					</Button>
					<InputSearch
						rounded="md"
						size="sm"
						bg="white"
						placeholder="Cari Pelanggan"
					/>
				</HStack>
				<DataTable
					maxH="400px"
					mt="4"
					apiUrl={API_URL + '/groups/' + id + '/users?status=approved'}
					columns={usersColumns}
					emptyMsg={[
						'Belum ada Pelanggan',
						'Tambahkan Pelanggan sekarang',
					]}
				/>
			</Container>
			<EditNodeModal
				mutate={mutate}
				data={data}
				onClose={editUserOnClose}
				isOpen={editUserIsOpen}
			/>
		</>
	);
}
