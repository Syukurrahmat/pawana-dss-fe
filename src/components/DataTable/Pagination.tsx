import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import React from "react";

export const Pagination = ({ tableLib, sizes }: any) => (
    <HStack>
        <IconButton
            aria-label="Sebelumnya"
            icon={<IconChevronsLeft size='20' />}
            variant='outline'
            disabled={!tableLib.getCanPreviousPage()}
            onClick={() => tableLib.setPageIndex(0)}
        />
        <IconButton
            aria-label="Sebelumnya"
            icon={<IconChevronLeft size='20' />}
            variant='outline'
            disabled={!tableLib.getCanPreviousPage()}
            onClick={tableLib.previousPage}
        />

        <Text>
            Halaman {tableLib.getState().pagination.pageIndex + 1}{" "}
            dari {tableLib.getPageCount()}
        </Text>

        <IconButton
            aria-label="Sebelumnya"
            icon={<IconChevronRight size='20' />}
            variant='outline'
            disabled={!tableLib.getCanNextPage()}
            onClick={ tableLib.nextPage}
        />
        <IconButton
            aria-label="Sebelumnya"
            icon={<IconChevronsRight size='20' />}
            variant='outline'
            disabled={!tableLib.getCanNextPage()}
            onClick={()=>tableLib.setPageIndex(tableLib.getPageCount() - 1)}
        />
       
        <span>Show: </span>
        <select
            value={tableLib.getState().pageSize}
            onChange={(e) => tableLib.setPageSize(parseInt(e.target.value, 10))}
        >
            {sizes.map((size: any) => (
                <option key={size} value={size}>
                    {size}
                </option>
            ))}
        </select>
        <span> items per page</span>
    </HStack>
);
