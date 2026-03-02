const PER_PAGE_OPTIONS = [1, 5, 10, 25, 50, 100];

export default function SearchEntries({
    showing,
    handleShow,
    searchTerm,
    handleSearch,
}) {
    return (
        <>
            <div className="show-entries">
                <p className="show-entries-show">Show</p>
                <select
                    id="length-data"
                    className="tw-p-1"
                    value={showing}
                    onChange={handleShow}
                >
                    {PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
                <p className="show-entries-entries">Entries</p>
            </div>
            <div className="search-column">
                <p>Search: </p>
                <input
                    type="search"
                    id="search-data"
                    placeholder="Search here..."
                    className="form-control"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
        </>
    );
}
