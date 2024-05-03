import { API_URL } from '@/config';
import { buildMapURL, fetcher, toFormatedDate } from '@/utils/index.utils';
import { Avatar, Box, Container, HStack, Heading, Tag, Text, Button, useDisclosure, Link, TagLeftIcon, TagLabel, Skeleton, Spacer} from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconBrandGoogleMaps, IconCheck, IconCircleDot, IconCirclePlus, IconEdit, IconExternalLink, IconOutbound, IconPhone, IconTextCaption, IconUser, IconUserHeart, IconUserQuestion, IconUsersGroup, IconX} from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditGroupModal from './editModal.group';
import SectionTitle from '@/components/common/sectionTitle';
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink } from 'react-router-dom';
import MyMap from '@/components/maps/index.maps';
import { useState } from 'react';
import HeadingWithIcon from '@/components/common/headingWithIcon';

const membersColumnHelper = createColumnHelper<userOfGroupData>();
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

	nodesColumnHelper.accessor((row) => [row.latitude, row.longitude], {
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

const membersColumns = [
	membersColumnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<RLink to={'/users/' + info.row.original.userId}>
				<HStack spacing="4">
					<Avatar name={info.getValue()} size="sm" />
					<Text>{info.getValue()}</Text>
				</HStack>
			</RLink>
		),
		meta: { sortable: true },
	}),
	membersColumnHelper.accessor('GroupPermissions.permission', {
		header: 'Izin',
		cell: (info) => <Tag>{info.getValue()}</Tag>,
	}),
	membersColumnHelper.accessor('GroupPermissions.joinedAt', {
		header: 'Bergabung pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),
	membersColumnHelper.accessor('userId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<Button
					colorScheme="red"
					size="xs"
					leftIcon={<IconOutbound size="16" />}
				>
					Keluarkan
				</Button>
			</HStack>
		),
	}),
];
const memberRequestColumns = [
	membersColumnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<HStack spacing="4">
				<Avatar name={info.getValue()} size="sm" />
				<Text>{info.getValue()}</Text>
			</HStack>
		),
		meta: { sortable: true },
	}),

	membersColumnHelper.accessor('GroupPermissions.requestJoinAt', {
		header: 'Meminta pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),
	membersColumnHelper.accessor('userId', {
		header: 'Aksi',
		cell: (info) => (
			<HStack>
				<Button
					colorScheme="green"
					size="xs"
					leftIcon={<IconCheck size="16" />}
				>
					Terima
				</Button>
				<Button colorScheme="red" size="xs" leftIcon={<IconX size="16" />}>
					Tolak
				</Button>
			</HStack>
		),
	}),
];

export default function DetailGroup() {
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

	const data: detailOfGroupData = rawData?.result;

	if (!data) return '';

	return (
		<>
			<HeadingWithIcon Icon={<IconUserHeart />} text="Detail Grup" />
			<Container mt="8" maxW="container.md">
				<HStack justify="space-between">
					<Box>
						<Heading fontSize="3xl" children={data.name} />
						<HStack mt="2">
							<Tag size="md" variant="subtle" colorScheme="green">
								<TagLeftIcon boxSize="16px" as={IconUser} />
								<TagLabel>{data.membersCount | 0} Pelanggan</TagLabel>
							</Tag>
							{Boolean(data.memberRequestsCount) && (
								<Tag size="md" variant="subtle" colorScheme="orange">
									<TagLeftIcon boxSize="16px" as={IconUserQuestion} />
									<TagLabel>
										{data.memberRequestsCount} Permintaan
									</TagLabel>
								</Tag>
							)}
							<Tag size="md" variant="subtle" colorScheme="blue">
								<TagLeftIcon boxSize="16px" as={IconCircleDot} />
								<TagLabel>{data.nodeCount | 0} Node</TagLabel>
							</Tag>
						</HStack>
						<RLink to={data.manager?.userId ? '../users/' + data.manager.userId : ''}>
							<HStack
								spacing="3"
								shadow="xs"
								mt="3"
								py="3"
								px="4"
								rounded="md"
								overflow="hidden"
								bg="gray.50"
								position="relative"
							>
								<Text
									pos="absolute"
									right="0"
									top="0"
									px="2"
									bg="gray.100"
									fontSize="sm"
									fontWeight="700"
									roundedBottomStart="md"
									children="MANAGER"
								/>
								<Avatar name={data.manager.name} rounded="md" />
								<Box>
									<Text fontSize="lg" fontWeight="600">
										{data.manager.name}
									</Text>
									<HStack spacing="2" pr="90px">
										<IconPhone size="16" />
										<Text>{data.manager.phone}</Text>
									</HStack>
								</Box>
							</HStack>
						</RLink>
					</Box>

					<Button
						onClick={editUserOnOpen}
						variant="outline"
						colorScheme="blue"
						alignSelf="start"
						size="sm"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Grup'}
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
					columns={membersColumns}
					emptyMsg={[
						'Belum ada Pelanggan',
						'Tambahkan Pelanggan sekarang',
					]}
				/>
				{Boolean(data.memberRequestsCount) && (
					<>
						<SectionTitle IconEl={IconUserQuestion}>
							Permintaan langganan
							<Tag colorScheme="blue" ml="2">
								{data.memberRequestsCount | 0}
							</Tag>
						</SectionTitle>
						<HStack mt="4" justify="space-between">
							<Button
								colorScheme="green"
								size="xs"
								leftIcon={<IconCheck size="16" />}
							>
								Terima Semua
							</Button>
							<Button
								colorScheme="red"
								size="xs"
								leftIcon={<IconX size="16" />}
							>
								Tolak Semua
							</Button>
							<Spacer />
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
							apiUrl={
								API_URL + '/groups/' + id + '/users?status=pending'
							}
							columns={memberRequestColumns}
							emptyMsg={[
								'Belum ada Pelanggan',
								'Tambahkan Pelanggan sekarang',
							]}
						/>
					</>
				)}
			</Container>

			<EditGroupModal
				mutate={mutate}
				data={data}
				onClose={editUserOnClose}
				isOpen={editUserIsOpen}
			/>
		</>
	);
}
