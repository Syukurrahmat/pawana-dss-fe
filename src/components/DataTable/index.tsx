import { AccessorKeyColumnDef, ColumnDef, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'; //prettier-ignore
import { Table, Thead, Tbody, Tr, Th, Td, chakra, TableContainer, HStack, Text, BoxProps, TableCaption, Skeleton} from '@chakra-ui/react'; //prettier-ignore
import { IconArrowsSort, IconSortAscending2, IconSortDescending2} from '@tabler/icons-react'; //prettier-ignore
import usePagination from './usePagination';
import useSorting from './useSorting';
import { Pagination } from './Pagination';
import useSWR from 'swr';
import { API_URL } from '@/config';
import { buildQueriesURL, fetcher } from '@/utils/index.utils';

interface IDataTable extends BoxProps {
	apiUrl: string;
	columns: AccessorKeyColumnDef<any, any>[];
}

export default function DataTable({ apiUrl, columns, ...rest }: IDataTable) {
	const { pagination, pageIndex, limit, onPaginationChange } = usePagination();
	const { sorting, field, order, onSortingChange } = useSorting();

	const { data, error, isLoading } = useSWR<PaginationDataRes>(
		buildQueriesURL(apiUrl, {
			page: pageIndex + 1,
			limit: limit,
			sort: field,
			order: order,
		}),
		fetcher
	);

	const table = useReactTable({
		data: data?.result || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		onPaginationChange,
		onSortingChange,
		state: { pagination, sorting },
		rowCount: data?.totalItems || 0,
	});
	return (
		<>
			<TableContainer
				shadow="xs"
				bg="white"
				rounded="md"
				className="fixTableHead"
				// maxHeight="400px"
				w="full"
				{...rest}
			>
				<Table minH="300px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const meta: any = header.column.columnDef.meta;
									return (
										<Th
											key={header.id}
											onClick={
												meta?.sortable
													? header.column.getToggleSortingHandler()
													: () => null
											}
											isNumeric={meta?.isNumeric}
										>
											<HStack justify="space-between">
												<Text>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</Text>
												<chakra.span boxSize="1.2em">
													{meta?.sortable ? (
														header.column.getIsSorted() ? (
															header.column.getIsSorted() ===
															'desc' ? (
																<IconSortDescending2
																	size="18"
																	aria-label="sorted descending"
																/>
															) : (
																<IconSortAscending2
																	size="18"
																	aria-label="sorted ascending"
																/>
															)
														) : (
															<IconArrowsSort
																size="18"
																style={{ opacity: 0.4 }}
																aria-label="sorting"
															/>
														)
													) : null}
												</chakra.span>
											</HStack>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{isLoading &&
							Array.from({ length: 5 }, (_, i) => (
								<Tr key={i}>
									<Td colSpan={9999}>
										<Skeleton h="30px" />
									</Td>
								</Tr>
							))}

						{table.getRowModel().rows.map((row) => (
							<Tr key={row.id}>
								{row.getVisibleCells().map((cell) => {
									// see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
									const meta: any = cell.column.columnDef.meta;
									return (
										<Td key={cell.id} isNumeric={meta?.isNumeric}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</Td>
									);
								})}
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<Pagination table={table} sizes={[10, 25, 50, 75, 100]} />
		</>
	);
}
