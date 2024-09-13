import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import LoadingComponent from '@/components/common/LoadingComponent';
import MyMap from '@/components/Maps';
import { TagNodeStatus } from '@/components/Tags/index.tags';
import CompanyIcon from '@/components/common/CompanyIcon';
import GMapsButton from '@/components/common/GMapsButton';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import { StatWithIcon } from '@/components/common/StatWithIcon';
import { nodeStatusAttr, nodeTypeAttr } from '@/constants/enumVariable';
import { useHashBasedTabsIndex } from '@/hooks/useHashBasedTabsIndex';
import useUser from '@/hooks/useUser';
import { toFormatedDatetime } from '@/utils/dateFormating';
import { fetcher } from '@/utils/fetcher';
import { Box, Button, Flex, Grid, HStack, Skeleton, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconCircleDot, IconExternalLink, IconPlus } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table'; //prettier-ignore
import { Link as RLink, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const columnHelper = createColumnHelper<NodeData>();
const columnsPublicNodeTable = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor('isUptodate', {
		header: 'Status',
		cell: (info) => <TagNodeStatus value={info.getValue()} />,
	}),

	columnHelper.accessor('address', {
		header: 'Alamat',
		cell: (info) => (
			<Text noOfLines={2} whiteSpace="wrap" children={info.getValue()} />
		),
	}),

	columnHelper.accessor('coordinate', {
		header: 'Koordinat',
		cell: (info) => <GMapsButton coordinate={info.getValue()} />,
	}),

	columnHelper.accessor('lastDataSent', {
		header: 'Terakhir data dikirim',
		cell: (info) => toFormatedDatetime(info.getValue()) || '-',
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
export const columPrivateNodeTable = [
	...columnsPublicNodeTable.slice(0, 2),

	columnHelper.accessor('owner', {
		header: 'Perusahaan',
		cell: (info) => (
			<RLink to={'/companies/' + info.getValue()!.companyId}>
				<HStack>
					<CompanyIcon type={info.getValue()!.type} />
					<Text>{info.getValue()!.name}</Text>
				</HStack>
			</RLink>
		),
	}),
	...columnsPublicNodeTable.slice(4),
];

export default function NodeManagement() {
	const { roleIs } = useUser();
	const navigate = useNavigate();

	const tabsList = [
		{ label: 'Daftar Node Publik', key: 'public' },
		{ label: 'Daftar Node Privat', key: 'private' },
		{ label: 'Lihat Dalam Maps', key: 'map' },
	];

	const tabs = roleIs('manager') ? [tabsList[1]] : tabsList;
	const [tabIndex, handleTabsChange] = useHashBasedTabsIndex(
		tabs.map((e) => e.key)
	);

	const { data } = useSWR<NodesSummary>('/nodes/overview', fetcher);
	if (!data) return <LoadingComponent />;

	const summaryList = [
		{
			label: 'Status Node',
			data: data.status,
			flex: '1 0 100px',
		},
		{
			label: 'Kepemilikan Node',
			data: data.ownership,
			flex: '1 0 100px',
		},
	];

	return (
		<Flex gap="2" flexDir="column">
			<HStack w="full" spacing="4" align="start" wrap="wrap">
				<HeadingWithIcon Icon={<IconCircleDot />} text="Daftar Node" />

				<Spacer flexGrow="999" />
				<HStack wrap="wrap" justify="end" flexBasis="450px" flexGrow="1">
					<InputSearch
						w="225px"
						flex="1 0 "
						bg="white"
						placeholder="Cari .."
						_onSubmit={null}
					/>
					{roleIs('admin') && (
						<Button
							leftIcon={<IconPlus size="20px" />}
							colorScheme="green"
							children="Tambah Node"
							onClick={() => navigate('./create')}
						/>
					)}
				</HStack>
			</HStack>

			<Flex
				mt="2"
				gap="2"
				direction={['column', 'row']}
				justify="space-between"
				align="stretch"
			>
				<StatWithIcon
					height="initial"
					flexBasis={['100px', '150px', null, '200px']}
					icon={IconCircleDot}
					count={data.all}
					label="Total Node"
					variant="solid"
					bg="blue.400"
				/>

				{summaryList.map(({ label, data, flex }) => (
					<Box
						flex={flex}
						key={label}
						p="2"
						rounded="md"
						border="1px solid"
						borderColor="gray.300"
					>
						<Text fontWeight="600" mb="1" children={label} />
						<Grid
							gap="3"
							gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
						>
							{data.map((e, i) => {
								const { color, name, icon } = {
									...nodeStatusAttr,
									...nodeTypeAttr,
								}[e.value];

								return (
									<StatWithIcon
										key={i}
										flex="1 0 180px"
										icon={icon}
										color={color}
										count={e.count}
										label={name}
									/>
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
				<TabList flexWrap="wrap" rowGap="4px">
					{tabs.map((e) => (
						<Tab key={e.key}>{e.label}</Tab>
					))}
				</TabList>
				<TabPanels flexGrow="1">
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/nodes?ownship=public'}
							columns={columnsPublicNodeTable}
						/>
					</TabPanel>
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/nodes?ownship=private'}
							columns={columPrivateNodeTable}
						/>
					</TabPanel>
					<TabPanel px="0" pb='0' flexGrow='1' >
						<NodesMapView />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
}

function NodesMapView() {
	const { data } = useSWR<Paginated<NodeData>>('/nodes?all=true', fetcher);
	const mapHeight = '450px'

	if (!data) return  <Skeleton h={mapHeight} rounded='md'/>
	
	const indoorNodeInCompanies = Object.values(
		data.rows
			.filter((e) => e.companyId && e.owner)
			.reduce((acc: Record<number, any>, item) => {
				const { coordinate, owner, ...rest } = item;
				const { name, companyId, type } = owner!;

				if (!acc[companyId]) {
					acc[companyId] = {
						name,
						companyId,
						type,
						coordinate,
						indoorNodes: [],
					};
				}
				acc[companyId].indoorNodes.push(rest);
				return acc;
			}, {})
	);

	return (
		<MyMap
			h={mapHeight}
			companiesData={indoorNodeInCompanies}
			data={data.rows.filter((e) => !e.companyId)}
		/>
	);
}
