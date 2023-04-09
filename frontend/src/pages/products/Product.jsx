import React from "react";
import Case from "../../components/Case";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermDebounced, setSearchTermDebounced] = useState("");
    const [showing, setShowing] = useState(10);
    const MySwal = withReactContent(Swal);

    const baseURL = "http://127.0.0.1:8000/api";

    useEffect(() => {
        document.title = "Products";
        axios
            .get(
                `${baseURL}/products?page=${currentPage}&per_page=${showing}&search=${searchTerm}&showing=${showing}`
            )
            .then((data) => {
                setProducts(data.data.data.data);
                setTotalPages(data.data.data.last_page);
                setTotalProducts(data.data.data.total);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentPage, showing, searchTermDebounced]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchDebounced = useCallback(
        debounce((value) => {
            setSearchTermDebounced(value);
        }, 750),
        []
    );

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        handleSearchDebounced(value);
    };

    const handleShow = (event) => {
        setShowing(parseInt(event.target.value));
    };

    const handleDelete = (id) => {
        axios
            .delete(`${baseURL}/products/${id}`)
            .then((data) => {
                console.log("Success:", data);
                setProducts(products.filter((product) => product.id !== id));
                setTotalProducts(totalProducts - 1);
                MySwal.fire({
                    title: "Successfully!",
                    html: "Data deleted succesfully.",
                    icon: "success",
                    timer: 1500,
                });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Products</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <h3>Tabel Products</h3>
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
                        <div className="table-responsive tw-max-h-96">
                            <table>
                                <thead className="tw-sticky tw-top-0">
                                    <tr className="tw-text-gray-700">
                                        <th width="15%" className="text-center">
                                            No
                                        </th>
                                        <th>Name Product</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th className="text-center">
                                            <i className="fas fa-cog"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(products) &&
                                    products.length ? (
                                        products.map((product, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    {index + 1}
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.description}</td>
                                                <td>{product.price}</td>
                                                <td className="text-center">
                                                    <Link
                                                        to={`/edit/${product.id}`}
                                                        className="btn btn-warning mr-2"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                        className="btn btn-danger"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center"
                                            >
                                                Not data available in the table
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-4 p-3 table-responsive">
                            <div>
                                Showing {(currentPage - 1) * showing + 1} to{" "}
                                {Math.min(currentPage * showing, totalProducts)}{" "}
                                of {totalProducts} results
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
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            Prev
                                        </button>
                                    </li>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => (
                                            <li
                                                key={i}
                                                className={`page-item ${
                                                    i + 1 === currentPage
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        handlePageChange(i + 1)
                                                    }
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        )
                                    )}
                                    <li
                                        className={`page-item ${
                                            currentPage === totalPages
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    class="btn-modal"
                    data-toggle="modal"
                    data-target="#tambahDataModal"
                >
                    <i class="far fa-plus"></i>
                </button>
            </div>
            <div
                className="modal fade"
                data-backdrop="false"
                id="tambahDataModal"
                aria-labelledby="tambahDataModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="tambahDataModalLabel"
                            >
                                Tambah Data
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label for="nama_kategori">Kategori</label>
                                    <input
                                        type="text"
                                        wire:model="nama_kategori"
                                        id="nama_kategori"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary tw-bg-gray-300"
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary tw-bg-blue-500"
                                >
                                    Save Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Case>
    );
}
