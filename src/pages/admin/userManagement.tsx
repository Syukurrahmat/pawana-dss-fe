import useSWR from "swr";
import { usePagination } from "../../components/DataTable/usePagination";
import { useSorting } from "../../components/DataTable/useSorting";
import { API_URL } from "@/config";
import { fetcher } from "@/utils/index.utils";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box, TableContainer, HStack, Text, IconButton, VStack, Center, Heading, Spacer, Input, Button, Select } from "@chakra-ui/react";
import { IconArrowsSort, IconPlus, IconSortAscending, IconSortAscending2, IconSortDescending, IconSortDescending2, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { Pagination } from "@/components/DataTable/Pagination";

const columnHelper = createColumnHelper<userData>()
const columns = [
	columnHelper.accessor('name', {
		cell: info => info.getValue(),
		header: "Nama",
		meta: {
			sortable: true
		}
	}),
	columnHelper.accessor('email', {
		cell: info => info.getValue(),
		header: "Surel"
	}),
	columnHelper.accessor('phone', {
		cell: info => "0" + info.getValue(),
		header: "Telepon",

	}),
	columnHelper.accessor('role', {
		cell: info => info.getValue(),
		header: "Peran",
		meta: {
			sortable: true
		}
	}),
	columnHelper.accessor('createdAt', {
		cell: info => info.getValue(),
		header: "Dibuat pada",
		meta: {
			sortable: true
		}
	}),
]


export default function UserManagement() {
	const [userData, setUserData] = useState<userData[]>([])


	const { limit: pageLimit, onPaginationChange, pagination, pageIndex } = usePagination();
	const { sorting, onSortingChange, field, order } = useSorting();

	const { data, error, isLoading } = useSWR<usersAPIData>(
		`${API_URL}/users?page=${pageIndex + 1}&limit=${pageLimit}&sort=${field}&order=${order}`,
		fetcher
	);


	const pageCount = data ? Math.ceil(data?.totalItems / pageLimit) : 0;

	const table = useReactTable({
		data: data ? data.result : [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		onPaginationChange,
		onSortingChange,
		state: { pagination, sorting },
		pageCount,
	});

	return (
		<VStack spacing="6">
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center boxSize="35px" bg="gray.100" rounded="md" p="1">
						<IconUser />
					</Center>
					<Heading fontSize="2xl" fontWeight="600">
						Daftar Pengguna
					</Heading>
				</HStack>
				<Spacer />
				<Input type="text" w="200px" bg="white" placeholder="Cari .." />
				<Button leftIcon={<IconPlus size="20px" />} colorScheme="green">
					Tambah Pengguna
				</Button>
			</HStack>
			<TableContainer
				shadow="xs"
				bg="white"
				rounded="md"
				className="fixTableHead"
				maxHeight="400px"
				w="full"
			>
				<Table>
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const meta: any = header.column.columnDef.meta;
									return (
										<Th
											key={header.id}
											onClick={meta?.sortable ? header.column.getToggleSortingHandler() : () => null}
											isNumeric={meta?.isNumeric}
										>
											<HStack justify='space-between'>
												<Text>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
												</Text>
												<chakra.span boxSize='1.2em'>
													{
														meta?.sortable
															? header.column.getIsSorted() ?
																header.column.getIsSorted() === "desc" ?
																	<IconSortDescending2 size='18' aria-label="sorted descending" />
																	:
																	<IconSortAscending2 size='18' aria-label="sorted ascending" />
																:
																<IconArrowsSort size='18' style={{ opacity: 0.4 }} aria-label="sorting" />
															: null
													}
												</chakra.span>
											</HStack>



										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.map((row) => (
							<Tr key={row.id}>
								{row.getVisibleCells().map((cell) => {
									// see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
									const meta: any = cell.column.columnDef.meta;
									return (
										<Td key={cell.id} isNumeric={meta?.isNumeric}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</Td>
									);
								})}
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<HStack>
				<HStack>
					<Text whiteSpace='nowrap'>Tampilkan per halaman</Text>
					<Select placeholder='Select option' bg='white'>
						<option value='10'>10</option>
						<option value='25'>25</option>
						<option value='50'>50</option>
						<option value='75'>75</option>
						<option value='100'>100</option>
					</Select>
				</HStack>
			</HStack>
			<Text>

				{`${API_URL}/users?page=${pageIndex + 1}&limit=${pageLimit}&sort=${field}&order=${order}`}

			</Text>
			<Pagination tableLib={table} sizes={[10, 25, 50, 75, 100]} />
		</VStack>
	);
};
