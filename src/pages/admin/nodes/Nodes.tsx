import { HStack, Spacer, Button, Tag, Flex, Tabs, TabList, Tab, TabPanels, TabPanel, VStack, Text, Grid, Icon, Box} from '@chakra-ui/react'; //prettier-ignore
import { IconCircle, IconCircleDot, IconExternalLink, IconPlus} from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import { Link as RLink } from 'react-router-dom';
import DataTable from '@/components/DataTable';
import { toFormatedDate } from '@/utils/dateFormating';
import InputSearch from '@/components/form/inputSearch';
import GMapsButton from '@/components/common/GMapsButton';
import { TagNodeStatus, TagNodeType } from '@/components/tags/index.tags';
import { useHashBasedTabsIndex } from '@/hooks/useHashBasedTabsIndex';
import MyMap from '@/components/maps/index.maps';
import useSWR from 'swr';
import { apiFetcher, pageDataFetcher } from '@/utils/fetcher';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import { nodeStatusAttr, nodeTypeAttr } from '@/constants/enumVariable';

const columnHelper = createColumnHelper<NodeData>();

const columns = [
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
		header: 'Kepemilikan',
		cell: (info) => <TagNodeType isPrivate={Boolean(info.getValue())} />,
		meta: { sortable: true },
	}),
	columnHelper.accessor('coordinate', {
		header: 'Koordinat',
		cell: (info) => <GMapsButton coordinate={info.getValue()} />,
	}),

	columnHelper.accessor('lastDataSent', {
		header: 'Terakhir data dikirim',
		cell: (info) => toFormatedDate(info.getValue()) || '-',
	}),

	columnHelper.accessor('nodeId', {
		header: 'Aksi',
		cell: (info) => (
			<RLink to={'/nodes/' + info.getValue()}>
				<Button
					colorScheme="blue"
					size="sm"
					leftIcon={<IconExternalLink size="16" />}
					children="Detail"
				/>
			</RLink>
		),
	}),
];

export default function NodeManagement() {
	const [tabIndex, handleTabsChange] = useHashBasedTabsIndex(['list', 'map']);

	const { data } = useSWR<NodesSummary>('/nodes/summary', pageDataFetcher);

	if (!data) return <LoadingAnimation />;

	return (
		<Flex gap="2" flexDir="column">
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
			<Flex
				gap="3"
				direction={['column', 'row']}
				justify="space-between"
				flexWrap="wrap"
			>
				<VStack
					flex="1 0 180px"
					bg="blue.400"
					p="2"
					rounded="md"
					color="white"
					spacing="0"
					justify="center"
				>
					<HStack fontSize="3xl">
						<IconCircleDot />
						<Text fontWeight="600">{data.all}</Text>
					</HStack>
					<Text>Total Node</Text>
				</VStack>
				{[
					{ label: 'Kepemilikan Node', data: data.ownership },
					{ label: 'Status Node', data: data.status },
				].map(({ label, data }) => (
					<Box
						key={label}
						flex="20 0 0px"
						pb="2"
						rounded="md"
						px="3"
						border="1px solid"
						borderColor="gray.300"
					>
						<Text fontWeight="600" py="1" children={label} />
						<Grid
							gap="3"
							gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
						>
							{data.map((e, i) => {
								const { color, name, icon } = {
									...nodeStatusAttr,
									...nodeTypeAttr,
								}[e.value];
								return (
									<VStack
										bg={color + '.50'}
										key={'s' + i}
										border="2px solid"
										rounded="md"
										p="1"
										spacing="0"
										borderColor={color + '.200'}
									>
										<HStack spacing="3">
											<Icon
												color={color + '.500'}
												as={icon}
												boxSize="28px"
											/>
											<Text fontSize="2xl" fontWeight="600">
												{e.count}
											</Text>
										</HStack>
										<Text fontWeight="600">{name}</Text>
									</VStack>
								);
							})}
						</Grid>
					</Box>
				))}
			</Flex>

			<Tabs
				display="flex"
				flexDir="column"
				flexGrow="1"
				index={tabIndex}
				onChange={handleTabsChange}
				isLazy
			>
				<TabList>
					<Tab>Daftar Node</Tab>
					<Tab>Lihat Dalam Maps</Tab>
				</TabList>
				<TabPanels flexGrow="1">
					<TabPanel px="0">
						<DataTable flexGrow="1" apiUrl={'/nodes'} columns={columns} />
					</TabPanel>
					<TabPanel px="0" h="100%">
						<NodesMapView />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
}

function NodesMapView() {
	const { data } = useSWR('/nodes?all=true', apiFetcher);
	if (!data) return 'loading slurr';

	return (
		<MyMap h="100%" minH="350px" scrollWheelZoom={false} data={data.result} />
	);
}
