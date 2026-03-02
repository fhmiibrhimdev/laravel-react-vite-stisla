import { useState, useCallback } from "react";
import { debounce } from "lodash";

const DEBOUNCE_TIMEOUT = 750;

/**
 * Manages paginated table state: page, perPage, search with debounce.
 */
export function usePagination({
    initialPerPage = 10,
    debounceMs = DEBOUNCE_TIMEOUT,
} = {}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(initialPerPage);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const handleSearchDebounced = useCallback(
        debounce((value) => {
            setDebouncedSearch(value);
            setCurrentPage(1); // reset to page 1 on new search
        }, debounceMs),
        []
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        handleSearchDebounced(value);
    };

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return {
        currentPage,
        perPage,
        search,
        debouncedSearch,
        setCurrentPage,
        handleSearch,
        handlePerPageChange,
        handlePageChange,
    };
}
