import React, { Component } from "react";

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
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
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
