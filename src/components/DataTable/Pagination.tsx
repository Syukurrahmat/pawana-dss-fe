import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight} from '@tabler/icons-react'; //prettier-ignore
import { BoxProps, HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

interface IPagination extends BoxProps {
	table: Table<any>;
	sizes: number[];
}

export const Pagination = ({ table, sizes, ...rest }: IPagination) => (
	<HStack {...rest} w="full" justify="space-between">
		<HStack>
			<Text>Tampikan</Text>
			<Select
				size="sm"
				w="fit-content"
				bg="white"
				value={table.getState().pagination.pageSize}
				onChange={(e) => table.setPageSize(parseInt(e.target.value, 10))}
			>
				{sizes.map((size) => (
					<option key={size} value={size} children={size} />
				))}
			</Select>
			<Text>item</Text>
		</HStack>
		{!(
			table.getState().pagination.pageIndex == 0 && table.getPageCount() <= 1
		) && (
			<HStack>
				<IconButton
					aria-label="Sebelumnya"
					icon={<IconChevronsLeft size="20" />}
					variant="outline"
					size="sm"
					colorScheme="green"
					isDisabled={!table.getCanPreviousPage()}
					onClick={() => table.setPageIndex(0)}
				/>
				<IconButton
					aria-label="Sebelumnya"
					icon={<IconChevronLeft size="20" />}
					variant="outline"
					size="sm"
					colorScheme="green"
					isDisabled={!table.getCanPreviousPage()}
					onClick={table.previousPage}
				/>

				<Text>
					{table.getState().pagination.pageIndex + 1} dari{' '}
					{table.getPageCount()}
				</Text>

				<IconButton
					aria-label="Sebelumnya"
					icon={<IconChevronRight size="20" />}
					variant="outline"
					size="sm"
					colorScheme="green"
					isDisabled={!table.getCanNextPage()}
					onClick={table.nextPage}
				/>
				<IconButton
					aria-label="Sebelumnya"
					icon={<IconChevronsRight size="20" />}
					variant="outline"
					size="sm"
					colorScheme="green"
					isDisabled={!table.getCanNextPage()}
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				/>
			</HStack>
		)}
	</HStack>
);
