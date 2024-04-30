import { useState } from "react";

export default function usePagination(pageSizeInit: number = 10) {
    const [pagination, setPagination] = useState({
        pageSize: pageSizeInit,
        pageIndex: 0,
    });
    const { pageSize, pageIndex } = pagination;

    return {
        onPaginationChange: setPagination,
        pagination,
        limit: pageSize,
        skip: pageSize * pageIndex,
        pageIndex
    };
}