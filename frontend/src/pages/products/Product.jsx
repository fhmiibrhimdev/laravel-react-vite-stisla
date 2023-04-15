import React from "react";
import Case from "../../components/Case";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import MainLayout from "../Layout/MainLayout";

export default function Product() {
    const baseURL = "http://127.0.0.1:8000/api";

    const [products, setProducts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermDebounced, setSearchTermDebounced] = useState("");
    const [showing, setShowing] = useState(10);

    const [refetch, setRefetch] = useState(Math.random());
    const MySwal = withReactContent(Swal);

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
    }, [currentPage, showing, searchTermDebounced, refetch]);

    const [modalData, setModalData] = useState(null);
    const [isEditing, setIsEditing] = useState(null);

    /**
     * Initial form, reset input fields, and validate the form
     */

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
    });

    const initialFormData = {
        name: "",
        description: "",
        price: "",
    };

    const [formErrors, setFormErrors] = useState({
        name: "",
        description: "",
        price: "",
    });

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        // Validate input name
        if (!formData.name) {
            formIsValid = false;
            errors.name = "Name is required";
        }

        // Validate input description
        if (!formData.description) {
            formIsValid = false;
            errors.description = "Description is required";
        }

        // Validate input price
        if (!formData.price) {
            formIsValid = false;
            errors.price = "Price is required";
        } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
            formIsValid = false;
            errors.price = "Price is invalid";
        }

        setFormErrors(errors);
        return formIsValid;
    };

    /**
     * Handle searching, pagination, and showing data
     */

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

    /**
     * Handle request
     */

    const handleAdd = () => {
        setModalData(null);
        setIsEditing(false);
        setFormData(initialFormData);
    };

    const handleEdit = (id) => {
        const data = products.find((product) => product.id === id);
        setModalData(data);
        setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
        });
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isEditing) {
            if (validateForm()) {
                axios
                    .post(`${baseURL}/products`, formData, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            Swal.fire({
                                title: "Success!",
                                text: "Data created successfully",
                                icon: "success",
                                timer: 1500,
                            }).then(() => {
                                $(".modal").modal("hide");
                                setRefetch(Math.random()); // refetch new data
                                setFormData(initialFormData); // set initial value for input
                            });
                        } else {
                            throw new Error("Network response was not ok");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        } else {
            if (validateForm()) {
                axios
                    .put(`${baseURL}/products/${modalData.id}`, formData, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            Swal.fire({
                                title: "Success!",
                                text: "Data updated successfully",
                                icon: "success",
                                timer: 1500,
                            }).then(() => {
                                $(".modal").modal("hide");
                                setRefetch(Math.random()); // refetch new data
                                setFormData(initialFormData); // set initial value for input
                            });
                        } else {
                            throw new Error("Network response was not ok");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        }
    };

    /**
     * Handle delete request
     */

    const handleConfirmationDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id);
            }
        });
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
                MySwal.fire({
                    title: "Oops...",
                    html: "Something went wrong.",
                    icon: "error",
                    timer: 1500,
                });
            });
    };

    return (
        <MainLayout>
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
                                            <th
                                                width="15%"
                                                className="text-center"
                                            >
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
                                                    <td>
                                                        {product.description}
                                                    </td>
                                                    <td>{product.price}</td>
                                                    <td className="text-center">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    product.id
                                                                )
                                                            }
                                                            className="btn btn-primary mr-2"
                                                            data-toggle="modal"
                                                            data-target="#formDataModal"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleConfirmationDelete(
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
                                                    Not data available in the
                                                    table
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination and showing data */}
                            <div className="d-flex justify-content-between align-items-center mt-4 p-3 table-responsive">
                                <div>
                                    Showing {(currentPage - 1) * showing + 1} to{" "}
                                    {Math.min(
                                        currentPage * showing,
                                        totalProducts
                                    )}{" "}
                                    of {totalProducts} results
                                </div>
                                <div>
                                    <ul className="pagination">
                                        <li
                                            className={`page-item ${
                                                currentPage === 1
                                                    ? "disabled"
                                                    : ""
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
                                                            handlePageChange(
                                                                i + 1
                                                            )
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
                            {/* Pagination and showing data */}
                        </div>
                    </div>
                    <button
                        className="btn-modal"
                        data-toggle="modal"
                        data-target="#formDataModal"
                        onClick={handleAdd}
                    >
                        <i className="far fa-plus"></i>
                    </button>
                </div>

                <div
                    className="modal fade"
                    id="formDataModal"
                    aria-labelledby="formDataModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="formDataModalLabel"
                                >
                                    {isEditing ? "Edit Data" : "Add Data"}
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
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="name">
                                            Product name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className={`form-control ${
                                                formErrors.name
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.name || ""}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.name && (
                                            <div className="invalid-feedback">
                                                {formErrors.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            className={`form-control ${
                                                formErrors.description
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            style={{ height: 100 }}
                                            value={formData.description || ""}
                                            onChange={handleInputChange}
                                        ></textarea>
                                        {formErrors.description && (
                                            <div className="invalid-feedback">
                                                {formErrors.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price">Price</label>
                                        <input
                                            type="text"
                                            name="price"
                                            id="price"
                                            className={`form-control ${
                                                formErrors.price
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            value={formData.price || ""}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.price && (
                                            <div className="invalid-feedback">
                                                {formErrors.price}
                                            </div>
                                        )}
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
        </MainLayout>
    );
}
