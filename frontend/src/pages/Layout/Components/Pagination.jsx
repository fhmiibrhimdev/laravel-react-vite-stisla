export default function Pagination({ currentPage, showing, totalRows, totalPages, handlePageChange }) {
    const from = (currentPage - 1) * showing + 1;
    const to = Math.min(currentPage * showing, totalRows);

    return (
        <div className="tw-mt-4 tw-flex tw-flex-col tw-items-center tw-overflow-x-auto tw-px-4 lg:tw-flex-row lg:tw-justify-between">
            <div>
                Showing {from} to {to} of {totalRows} results
            </div>
            <div>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Prev
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
