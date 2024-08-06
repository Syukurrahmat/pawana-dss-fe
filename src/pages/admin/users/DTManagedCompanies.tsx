import DataTable from '@/components/DataTable';
import MyMap from '@/components/Maps';
import { TagCompanyType } from '@/components/Tags/index.tags';
import { ButtonViewDashboard } from '@/components/common/ChangeActiveDashButton';
import { companyTypeAttr } from '@/constants/enumVariable';
import { toFormatedDate } from '@/utils/dateFormating';
import { Box, BoxProps, Button, Center, HStack, Icon, Skeleton, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { Link as RLink } from 'react-router-dom';
import { KeyedMutator } from 'swr';

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
				<RLink to={'/companies/' + info.getValue()}>
					<Button
						colorScheme="blue"
						size="sm"
						leftIcon={<IconExternalLink size="16" />}
						children="Detail"
					/>
				</RLink>
				<ButtonViewDashboard
					size="sm"
					companyId={info.row.original.companyId}
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
