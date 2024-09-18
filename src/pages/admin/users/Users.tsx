import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import LoadingComponent from '@/components/common/LoadingComponent';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import { TagUserRole } from '@/components/Tags/index.tags';
import { userRoleAttr } from '@/constants/enumVariable';
import useUser from '@/hooks/useUser';
import { toFormatedDate } from '@/utils/dateFormating';
import { fetcher } from '@/utils/fetcher';
import { Button, Flex, Grid, HStack, Link, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconPlus, IconUser, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table'; //prettier-ignore
import { Link as RLink, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { StatWithIcon } from '../../../components/common/StatWithIcon';
import { useHashBasedTabsIndex } from '../../../hooks/useHashBasedTabsIndex';

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
	const hashTabs = ['all', 'public', 'industry', 'admin', 'gov', 'unverified'];
	const [tabIndex, handleTabsChange] = useHashBasedTabsIndex(hashTabs);
	const { roleIs } = useUser();
	const { data } = useSWR<UsersSummary>('/users/overview', fetcher);
	const navigate = useNavigate();

	if (!data) return <LoadingComponent />;

	return (
		<Flex gap="2" flexDir="column">
			<HStack w="full" spacing="4" align="start" wrap="wrap">
				<HeadingWithIcon Icon={<IconUser />} text="Daftar Pengguna" />
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
							children="Tambah Pengguna"
							onClick={() => navigate('./create')}
						/>
					)}
				</HStack>
			</HStack>

			<Grid
				mt="2"
				gap="2"
				gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
			>
				<StatWithIcon
					icon={IconUsersGroup}
					count={data.all}
					label="Total Pengguna"
					variant="solid"
				/>
				{data.role.map((e, i) => {
					const { color, name, icon } = userRoleAttr[e.value];

					return (
						<StatWithIcon
							key={i}
							icon={icon}
							color={color}
							h="100%"
							count={e.count}
							label={name}
						/>
					);
				})}
			</Grid>

			<Tabs isLazy mt="2" index={tabIndex} onChange={handleTabsChange}>
				<TabList flexWrap="wrap" rowGap="4px">
					<Tab>Semua</Tab>
					<Tab>Masyarakat Umum</Tab>
					<Tab>Pemilik Usaha</Tab>
					<Tab>Admin</Tab>
					<Tab>Pemerintah</Tab>
					<Tab>Belum diverifikasi</Tab>
				</TabList>

				<TabPanels>
					<TabPanel px="0">
						<DataTable flexGrow="1" apiUrl={'/users'} columns={columns} />
					</TabPanel>
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=regular'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=manager'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=admin'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel px="0">
						<DataTable
							flexGrow="1"
							apiUrl={'/users?role=gov'}
							columns={columnWithOutRole}
						/>
					</TabPanel>
					<TabPanel px="0">
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
