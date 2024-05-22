import { toFormatedDate } from '@/utils/dateFormating';
import { HStack, Tag, Button, Center, Icon, Text} from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus, IconExternalLink, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link, Link as RLink, useParams } from 'react-router-dom';
import { useState } from 'react';
import SectionTitle from '@/components/common/SectionTitle';
import { companyTypeAttr } from '@/constants/enumVariable';
import { TagCompanyType } from '@/components/tags/index.tags';
import { KeyedMutator } from 'swr';

const columnHelper = createColumnHelper<DTUserManagedCompanies>();
const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: ({ getValue, row: { original } }) => (
			<HStack spacing="3">
				<Center
					rounded="md"
					border="2px solid"
					borderColor={companyTypeAttr[original.type].color + '.200'}
					color={companyTypeAttr[original.type].color + '.500'}
					p="2"
				>
					<Icon as={companyTypeAttr[original.type].icon} boxSize="18px" />
				</Center>
				<Text>{getValue()}</Text>
			</HStack>
		),
		meta: { sortable: true },
	}),

	columnHelper.accessor('type', {
		header: 'Jenis ',
		cell: (info) => <TagCompanyType type={info.getValue()} />,
		meta: { sortable: true },
	}),

	columnHelper.accessor('createdAt', {
		id: 'createdAt',
		header: 'Dibuat Pada',
		cell: (info) => toFormatedDate(info.getValue()),
		meta: { sortable: true },
	}),

	columnHelper.accessor('companyId', {
		header: 'Aksi',
		cell: (info) => (
			<RLink to={'/companies/' + info.getValue()}>
				<Button
					colorScheme="blue"
					size="xs"
					leftIcon={<IconExternalLink size="16" />}
					children="Lihat Aktivitas"
				/>
			</RLink>
		),
	}),
];

export default function ManagedCompaniesList({
	data,
}: DataAndMutateProp<UserDataPage>) {
	return (
		<>
			<SectionTitle IconEl={IconUsersGroup}>
				Aktivitas Anda
				<Tag colorScheme="blue" ml="2">
					{data.countManagedCompany || 0}
				</Tag>
			</SectionTitle>

			<HStack mt="4" justify="space-between">
				<Link to={"/companies/create"}>
					<Button
						colorScheme="blue"
						leftIcon={<IconCirclePlus size="18" />}
					>
						Tambahkan Aktivitas
					</Button>
				</Link>
				<InputSearch
					rounded="md"
					bg="white"
					placeholder="Cari Aktivitas"
					_onSubmit={null}
				/>
			</HStack>

			<DataTable
				mt="4"
				apiUrl={`/users/${data.userId}/companies`}
				columns={columns}
				emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
				hiddenPagination={true}
			/>
		</>
	);
}
