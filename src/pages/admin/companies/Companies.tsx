import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import MyMap from '@/components/Maps';
import { TagCompanyType } from '@/components/Tags/index.tags';
import CompanyIcon from '@/components/common/CompanyIcon';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import LoadingComponent from '@/components/common/LoadingComponent';
import { StatWithIcon } from '@/components/common/StatWithIcon';
import { companyTypeAttr } from '@/constants/enumVariable';
import { useHashBasedTabsIndex } from '@/hooks/useHashBasedTabsIndex';
import useUser from '@/hooks/useUser';
import { toFormatedDate } from '@/utils/dateFormating';
import { fetcher } from '@/utils/fetcher';
import { Avatar, Button, Flex, Grid, HStack, Skeleton, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconExternalLink, IconPlus } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table'; //prettier-ignore
import { Link as RLink, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const columnHelper = createColumnHelper<CompanyData>();
const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<HStack spacing="3">
				<CompanyIcon type={info.row.original.type} />
				<Text>{info.getValue()}</Text>
			</HStack>
		),
		meta: { sortable: true },
	}),
	columnHelper.accessor('type', {
		header: 'Jenis ',
		cell: (info) => <TagCompanyType value={info.getValue()} />,
		meta: { sortable: true },
	}),

	columnHelper.accessor('address', {
		header: 'Alamat',
		cell: (info) => (
			<Text noOfLines={2} whiteSpace="wrap" children={info.getValue()} />
		),
	}),

	columnHelper.accessor('manager', {
		header: 'Manager',
		cell: (info) => (
			<RLink to={'../users/' + info.getValue().userId}>
				<Button
					size="sm"
					py="5"
					variant="outline"
					w="full"
					justifyContent="left"
					leftIcon={<Avatar size="sm" name={info.getValue().name} />}
					children={info.getValue().name}
				/>
			</RLink>
		),
	}),

	columnHelper.accessor('createdAt', {
		header: 'Dibuat pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),

	columnHelper.accessor('companyId', {
		header: 'Aksi',
		cell: (info) => (
			<RLink to={'/companies/' + info.getValue()}>
				<Button
					colorScheme="blue"
					size="sm"
					leftIcon={<IconExternalLink size="16" />}
				>
					Detail
				</Button>
			</RLink>
		),
	}),
];

export default function CompaniesManagement() {
	const [tabIndex, handleTabsChange] = useHashBasedTabsIndex(['list', 'map']);
	const { roleIs } = useUser();
	const { data } = useSWR<CompaniesSummary>('/companies/overview', fetcher);
	const navigate = useNavigate();

	if (!data) return <LoadingComponent />;

	return (
		<Flex gap="2" flexDir="column">
			<HStack w="full" spacing="4" align="start" wrap="wrap">
				<HeadingWithIcon
					Icon={<IconBuildingFactory2 />}
					text="Daftar Perusahaan"
				/>
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
							children="Tambah Perusahaan"
							onClick={() => navigate('./create')}
						/>
					)}
				</HStack>
			</HStack>

			<Grid
				mt="2"
				gap="2"
				gridTemplateColumns="repeat(auto-fit, minmax(140px, 1fr))"
			>
				<StatWithIcon
					icon={IconBuildingFactory2}
					count={data.all}
					label="Total Perusahaan"
					variant="solid"
				/>
				{data.type.map((e, i) => {
					const { color, name, icon } = companyTypeAttr[e.value];
					return (
						<StatWithIcon
							key={i}
							h="100%"
							icon={icon}
							count={e.count}
							label={name}
							color={color}
						/>
					);
				})}
			</Grid>
			<Tabs
				display="flex"
				flexDir="column"
				flexGrow="1"
				index={tabIndex}
				onChange={handleTabsChange}
				isLazy
			>
				<TabList flexWrap="wrap" rowGap="4px">
					<Tab>Daftar Perusahaan</Tab>
					<Tab>Lihat Dalam Maps</Tab>
				</TabList>
				<TabPanels flexGrow="1">
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/companies'}
							columns={columns}
						/>
					</TabPanel>
					<TabPanel px="0"  pb='0' flexGrow="1">
						<NodesMapView />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
}

function NodesMapView() {
	const { data } = useSWR<Paginated<CompanyData>>(
		'/companies?all=true',
		fetcher
	);
	const mapHeight = '450px'
	
	if (!data) return  <Skeleton h={mapHeight} rounded='md'/>
	return <MyMap h={mapHeight} scrollWheelZoom={false} data={data.rows} />;
}
