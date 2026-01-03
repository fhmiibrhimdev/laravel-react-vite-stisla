import React from "react";
import Case from "../components/Case";
import { useEffect } from "react";

export default function GeneralFeature() {
    useEffect(() => {
        document.title = "General Feature";
    }, []);

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">General Feature</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <h3>Tabel General Feature</h3>
                        <div className="show-entries">
                            <p className="show-entries-show">Show</p>
                            <select id="length-data" className="tw-p-1">
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
                            />
                        </div>
                        <div className="table-responsive tw-max-h-96">
                            <table>
                                <thead className="tw-sticky tw-top-0">
                                    <tr className="tw-text-gray-700">
                                        <th width="15%" className="text-center">
                                            No
                                        </th>
                                        <th>Name General</th>
                                        <th className="text-center">
                                            <i className="fas fa-cog"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td>1</td>
                                        <td className="text-left">
                                            Air Document Intelligence
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-warning mr-2"
                                                data-toggle="modal"
                                                data-target="#ubahDataModal"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-danger">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 table-responsive tw-mb-[-15px]"></div>
                    </div>
                </div>
            </div>
        </Case>
    );
}
