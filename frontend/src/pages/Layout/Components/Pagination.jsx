import React, { Component } from "react";

export default function Pagination({
    currentPage,
    showing,
    totalRows,
    totalPages,
    handlePageChange,
}) {
    return (
        <div className="d-flex justify-content-between align-items-center mt-4 p-3 table-responsive">
            <div>
                Showing {(currentPage - 1) * showing + 1} to{" "}
                {Math.min(currentPage * showing, totalRows)} of {totalRows}{" "}
                results
            </div>
            <div>
                <ul className="pagination">
                    <li
                        className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i}
                            className={`page-item ${
                                i + 1 === currentPage ? "active" : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
