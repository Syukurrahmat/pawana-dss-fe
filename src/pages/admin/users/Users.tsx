import { createColumnHelper} from '@tanstack/react-table'; //prettier-ignore
import { HStack, Spacer, Button, Link, Flex, Grid} from '@chakra-ui/react'; //prettier-ignore
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { IconExternalLink, IconPlus, IconUser, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import DataTable from '@/components/DataTable';
import { Link as RLink } from 'react-router-dom';
import { toFormatedDate } from '@/utils/dateFormating';
import InputSearch from '@/components/Form/inputSearch';
import { userRoleAttr } from '@/constants/enumVariable';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import { useHashBasedTabsIndex } from '../../../hooks/useHashBasedTabsIndex';
import useSWR from 'swr';
import { pageDataFetcher } from '@/utils/fetcher';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import { TagUserRole } from '@/components/Tags/index.tags';
import LoadingComponent from '@/components/Loading/LoadingComponent';
import { StatWithIcon } from '../../../components/common/StatWithIcon';
import useUser from '@/hooks/useUser';

const columnHelper = createColumnHelper<UserData>();

const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<NameWithAvatar
				name={info.getValue()}
				profilePicture={info.row.original.profilePicture}
				size="sm"
			/>
		),
		meta: { sortable: true },
	}),
	columnHelper.accessor('email', {
		header: 'Surel',
		cell: (info) => (
			<Link href={'mailto:' + info.getValue()}>{info.getValue()}</Link>
		),
	}),
	columnHelper.accessor('phone', {
		header: 'Telepon',
		cell: (info) => (
			<Link href={'tel:+62' + info.getValue()}>{info.getValue()}</Link>
		),
	}),

	columnHelper.accessor('role', {
		header: 'Peran',
		cell: (info) => <TagUserRole value={info.getValue()} />,
		meta: { sortable: true },
	}),
	columnHelper.accessor('createdAt', {
		header: 'Dibuat pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),
	columnHelper.accessor('userId', {
		header: 'Aksi',
		cell: (info) => (
			<RLink to={'/users/' + info.getValue()}>
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

const columnWithOutRole = columns.filter((e) => e.accessorKey !== 'role');

export default function UserManagement() {
	const hashTabs = ['all', 'regular', 'manager', 'admin', 'gov', 'unverified'];
	const [tabIndex, handleTabsChange] = useHashBasedTabsIndex(hashTabs);
	const { roleIs } = useUser();
	const { data } = useSWR<UsersSummary>('/users/summary', pageDataFetcher);

	if (!data) return <LoadingComponent />;

	return (
		<Flex gap="2" flexDir="column">
			<HStack w="full" spacing="4" align="start">
				<HeadingWithIcon Icon={<IconUser />} text="Daftar Pengguna" />

				<Spacer />
				<InputSearch
					w="200px"
					bg="white"
					placeholder="Cari .."
					_onSubmit={null}
				/>
				{roleIs('admin') && (
					<RLink to="./create">
						<Button
							leftIcon={<IconPlus size="20px" />}
							colorScheme="green"
							children="Tambah Pengguna"
						/>
					</RLink>
				)}
			</HStack>

			<Flex
				gap="3"
				direction={['column', 'row']}
				justify="space-between"
				flexWrap="wrap"
			>
				<StatWithIcon
					flex="1 0 180px"
					icon={IconUsersGroup}
					count={data.all}
					label="Total Anggota"
					variant="solid"
				/>

				<Grid
					gap="3"
					flex="20 0 0px"
					gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
				>
					{data.role.map((e, i) => {
						const { color, name, icon } = userRoleAttr[e.value];

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
			</Flex>

			<Tabs isLazy index={tabIndex} onChange={handleTabsChange}>
				<TabList>
					<Tab>Semua</Tab>
					<Tab>Regular</Tab>
					<Tab>Manager</Tab>
					<Tab>Admin</Tab>
					<Tab>Pemerintah</Tab>
					<Tab>Belum diverifikasi</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<DataTable flexGrow="1" apiUrl={'/users'} columns={columns} />
					</TabPanel>
					<TabPanel>
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=regular'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel>
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=manager'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel>
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=admin'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel>
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=gov'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel>
						<DataTable
							flexGrow="1"
							apiUrl={'/users?unverified=true'}
							columns={columns.slice(0, -1)}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
}
