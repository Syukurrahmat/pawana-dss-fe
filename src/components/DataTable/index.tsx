import { fetcher, UrlWithQuery } from '@/utils/fetcher';
import { Box, BoxProps, chakra, HStack, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconArrowsSort, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-react'; //prettier-ignore
import { ColumnDef, flexRender, getCoreRowModel, OnChangeFn, Row, RowSelectionState, useReactTable } from '@tanstack/react-table'; //prettier-ignore
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { Pagination } from './Pagination';
import usePagination from './usePagination';
import useSorting from './useSorting';

interface IDataTable extends BoxProps {
	apiUrl: string;
	columns: ColumnDef<any, any>[];
	enableMultiRowSelection?: boolean;
	emptyMsg?: string[];
	setDataContext?: React.Dispatch<any>;
	getRowId?: (originalRow: any, index: number, parent?: Row<any>) => string;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;
	searchQuery?: string;
	withHeader?: boolean;
	hiddenPagination?: boolean;
}

export default function DataTable({
	apiUrl,
	columns,
	emptyMsg,
	setDataContext,
	getRowId,
	rowSelection,
	onRowSelectionChange,
	searchQuery,
	enableMultiRowSelection = false,
	withHeader = true,
	hiddenPagination = false,
	...rest
}: IDataTable) {
	const { pagination, pageIndex, limit, onPaginationChange } = usePagination();
	const { sorting, field, order, onSortingChange } = useSorting();

	const itemcount = useRef({
		totalItems: 0,
		itemsInPage: 0,
	});

	const queries = {
		page: pageIndex + 1,
		limit: limit,
		sort: field,
		order: order,
		search: searchQuery ? searchQuery : undefined,
	};

	const { data: rawData, isLoading } = useSWR<Paginated>(
		UrlWithQuery(apiUrl, queries),
		fetcher
	);

	const data = rawData?.rows || [];

	useEffect(() => {
		if (setDataContext) setDataContext(rawData ? data : rawData);
	}, [data]);

	if (rawData) {
		itemcount.current = {
			totalItems: rawData.meta.total,
			itemsInPage: rawData.rows.length,
		};
	}

	const table = useReactTable({
		data,
		columns,
		onPaginationChange,
		onSortingChange,
		enableMultiRowSelection,
		getRowId,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		onRowSelectionChange,
		state: { pagination, sorting, rowSelection },
		rowCount: itemcount.current.totalItems,
	});

	return (
		<Box {...rest} maxH="inherit" h="fit-content" w="full">
			<Box shadow="xs" bg="white" rounded="md">
				{Boolean(searchQuery) && Boolean(rawData?.meta.total) && (
					<Text
						px="3"
						py="2"
						fontSize="md"
						fontWeight="600"
						borderBottom="1px solid"
						borderColor="gray.100"
					>
						Menampilkan {rawData?.meta.total} Item dari kata kunci "
						{searchQuery}"
					</Text>
				)}
				<TableContainer
					className="fixTableHead"
					w="full"
					h="fit-content"
					maxH={rest.maxH || rest.maxHeight}
				>
					<Table variant={withHeader ? '' : 'striped'}>
						<Thead>
							{withHeader &&
								table.getHeaderGroups().map((headerGroup) => (
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
								Array.from(
									{ length: itemcount.current.itemsInPage || 5 },
									(_, i) => (
										<Tr key={i}>
											<Td colSpan={9999}>
												<Skeleton h="28px" />
											</Td>
										</Tr>
									)
								)}
							{!isLoading && !data.length && (
								<Tr>
									<Td colSpan={9999}>
										<VStack py="2" color="gray.500">
											<Text fontSize="2xl" fontWeight="500">
												{emptyMsg ? emptyMsg[0] : 'Tidak ada data'}
											</Text>
											<Text>{emptyMsg ? emptyMsg[1] : ''}</Text>
										</VStack>
									</Td>
								</Tr>
							)}

							{table.getRowModel().rows.map((row) => (
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
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
			</Box>

			{!hiddenPagination && (
				<Pagination
					px="2"
					mt="3"
					table={table}
					sizes={[10, 25, 50, 75, 100]}
				/>
			)}
		</Box>
	);
}
