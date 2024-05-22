import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Spacer, Button, Avatar, Text, Flex, Grid, Tabs, TabList, Tab, TabPanels, TabPanel} from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconExternalLink, IconPlus, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { Link as RLink } from 'react-router-dom';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import { toFormatedDate } from '@/utils/dateFormating';
import InputSearch from '@/components/form/inputSearch';
import CompanyIcon from '@/components/common/CompanyIcon';
import useSWR from 'swr';
import { apiFetcher, pageDataFetcher } from '@/utils/fetcher';
import { companyTypeAttr } from '@/constants/enumVariable';
import { TagCompanyType } from '@/components/tags/index.tags';
import { StatWithIcon } from '@/components/common/StatWithIcon';
import { useHashBasedTabsIndex } from '@/hooks/useHashBasedTabsIndex';
import MyMap from '@/components/maps/index.maps';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

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
		cell: (info) => <TagCompanyType type={info.getValue()} />,
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

	const { data } = useSWR<CompaniesSummary>(
		'/companies/summary',
		pageDataFetcher
	);

	if (!data) return <LoadingAnimation />;

	return (
		<Flex gap="2" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HeadingWithIcon
					Icon={<IconUsersGroup />}
					text="Daftar Aktivitas"
				/>
				<Spacer />
				<InputSearch
					_onSubmit={null}
					w="200px"
					bg="white"
					placeholder="Cari .."
				/>
				<RLink to="./create">
					<Button
						leftIcon={<IconPlus size="20px" />}
						colorScheme="green"
						children="Tambah Aktivitas"
					/>
				</RLink>
			</HStack>
			<Flex
				gap="3"
				direction={['column', 'row']}
				justify="space-between"
				flexWrap="wrap"
			>
				<StatWithIcon
					flex="1 0 180px"
					icon={IconBuildingFactory2}
					count={data.all}
					label="Total Aktivitas"
					variant="solid"
				/>

				<Grid
					gap="3"
					flex="20 0 0px"
					gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
				>
					{data.type.map((e, i) => {
						const { color, name, icon } = companyTypeAttr[e.value];

						return (
							<StatWithIcon
								key={i}
								flex="1 0 180px"
								icon={icon}
								count={e.count}
								label={name}
								color={color}
							/>
						);
					})}
				</Grid>
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
						<DataTable
							flexGrow="1"
							apiUrl={'/companies'}
							columns={columns}
						/>
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
	const { data } = useSWR('/companies?all=true', apiFetcher);
	if (!data) return 'loading slurr';

	return (
		<MyMap
			h="100%"
			minH="350px"
			scrollWheelZoom={false}
			data={data.result.map((e: any) => ({ ...e, isCompanyLocation: true }))}
		/>
	);
}
