import { toFormatedDate } from '@/utils/dateFormating';
import { HStack, Box, Tag, Button, Center, Icon, Text, Spacer, Skeleton, BoxProps, IconButton} from '@chakra-ui/react'; //prettier-ignore
import { IconChartBar, IconCirclePlus, IconExternalLink, IconUsersGroup} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/Form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link, Link as RLink } from 'react-router-dom';
import SectionTitle from '@/components/common/SectionTitle';
import { companyTypeAttr } from '@/constants/enumVariable';
import { TagCompanyType } from '@/components/Tags/index.tags';
import { KeyedMutator } from 'swr';
import MyMap from '@/components/Maps';
import { useState } from 'react';

const columnHelper = createColumnHelper<DTUserManagedCompanies>();
const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => {
			const { color, icon } = companyTypeAttr[info.row.original.type];

			return (
				<HStack spacing="3">
					<Center
						rounded="md"
						border="2px solid"
						borderColor={color + '.200'}
						color={color + '.500'}
						p="2"
						children={<Icon as={icon} boxSize="18px" />}
					/>
					<Text>{info.getValue()}</Text>
				</HStack>
			);
		},
		meta: { sortable: true },
	}),

	columnHelper.accessor('type', {
		header: 'Jenis ',
		cell: (info) => <TagCompanyType value={info.getValue()} />,
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
			<HStack>
				{' '}
				<RLink to={'/companies/' + info.getValue()}>
					<Button
						colorScheme="blue"
						size="sm"
						leftIcon={<IconExternalLink size="16" />}
						children="Detail"
					/>
				</RLink>
				<Button
					size="sm"
					colorScheme="green"
					leftIcon={<IconChartBar size="16" />}
					children='Dashboard'
				/>
			</HStack>
		),
	}),
];

interface MCL extends BoxProps {
	data: Partial<UserDataPage>;
	mutate?: KeyedMutator<any>;
}

export default function ManagedCompaniesList({ data, ...rest }: MCL) {
	const [companiesDataCtx, setCompaniesDataCtx] = useState<null | any[]>(null);

	const showMap = companiesDataCtx == null || companiesDataCtx.length > 0;

	return (
		<Box {...rest}>
			{showMap && (
				<MyMap
					data={[]}
					companiesData={companiesDataCtx || []}
					as={companiesDataCtx == null ? Skeleton : undefined}
				/>
			)}
			<DataTable
				mt="4"
				apiUrl={`/users/${data.userId}/companies`}
				columns={columns}
				setDataContext={setCompaniesDataCtx}
				emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
				hiddenPagination={true}
			/>
		</Box>
	);
}
