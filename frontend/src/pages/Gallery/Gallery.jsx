import React from "react";
import Case from "../../components/Case";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import appConfig from "../../config/appConfig";

export default function Gallery() {
    const navigate = useNavigate();

    const [rows, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermDebounced, setSearchTermDebounced] = useState("");
    const [showing, setShowing] = useState(10);

    const [refetch, setRefetch] = useState(Math.random());
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        document.title = "Gallery";
        axios
            .get(
                `${appConfig.baseurlAPI}/gallery?page=${currentPage}&per_page=${showing}&search=${searchTerm}&showing=${showing}`
            )
            .then((data) => {
                setProducts(data.data.data.data);
                setTotalPages(data.data.data.last_page);
                setTotalRows(data.data.data.total);
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    navigate("/403");
                } else {
                    console.log(error);
                }
                setIsLoading(false);
            });
    }, [currentPage, showing, searchTermDebounced, refetch]);

    const [modalData, setModalData] = useState(null);
    const [isEditing, setIsEditing] = useState(null);

    /**
     * Initial form, reset input fields, and validate the form
     */

    const [formData, setFormData] = useState({
        name_gallery: "",
        description_gallery: "",
        image: null,
    });

    const initialFormData = {
        name_gallery: "",
        description_gallery: "",
        image: null,
    };

    const [formErrors, setFormErrors] = useState({
        name_gallery: "",
        description_gallery: "",
        image: null,
    });

    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        // Validate input name
        if (!formData.name_gallery) {
            formIsValid = false;
            errors.name_gallery = "Name gallery is required";
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
        }, appConfig.debounceTimeout),
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
        const data = rows.find((row) => row.id === id);
        setModalData(data);
        setFormData({
            name_gallery: data.name_gallery,
            description_gallery: data.description_gallery,
            image: null,
        });
        setIsEditing(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isEditing) {
            if (validateForm()) {
                axios
                    .post(`${appConfig.baseurlAPI}/gallery`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        if (response.status === 201) {
                            Swal.fire({
                                title: "Success!",
                                text: "Data created successfully",
                                icon: "success",
                                timer: 1500,
                            }).then(() => {
                                $(".modal").modal("hide");
                                setRefetch(Math.random());
                                setFormData(initialFormData);
                            });
                        } else {
                            throw new Error("Network response was not ok");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        MySwal.fire({
                            title: "Oops...",
                            html: "Something went wrong.",
                            icon: "error",
                            timer: 2000,
                        });
                    });
            }
        } else {
            if (validateForm()) {
                const data = new FormData();
                data.append("name_gallery", formData.name_gallery);
                data.append(
                    "description_gallery",
                    formData.description_gallery
                );
                data.append("image", formData.image);
                data.append("_method", "put");
                axios
                    .post(
                        `${appConfig.baseurlAPI}/gallery/${modalData.id}`,
                        data,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    )
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
                        MySwal.fire({
                            title: "Oops...",
                            html: "Something went wrong.",
                            icon: "error",
                            timer: 2000,
                        });
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
            .delete(`${appConfig.baseurlAPI}/gallery/${id}`)
            .then((data) => {
                console.log("Success:", data);
                setProducts(rows.filter((row) => row.id !== id));
                setTotalRows(totalRows - 1);
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
                    timer: 2000,
                });
            });
    };

    if (isLoading) {
        return (
            <Case>
                <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                    <h1 className="mb-1 tw-text-lg">Loading...</h1>
                </div>
            </Case>
        );
    }

    return (
        <Case>
            <div className="section-header px-4 tw-rounded-none tw-shadow-md tw-shadow-gray-200 lg:tw-rounded-lg">
                <h1 className="mb-1 tw-text-lg">Gallery</h1>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <h3>Table Gallery</h3>
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
                                        <th width="10%" className="text-center">
                                            No
                                        </th>
                                        <th width="10%">Image</th>
                                        <th>Name Gallery</th>
                                        <th>Description</th>
                                        <th className="text-center">
                                            <i className="fas fa-cog"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(rows) && rows.length ? (
                                        rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <a
                                                        href={
                                                            appConfig.baseURL +
                                                            "/storage/images/" +
                                                            row.image
                                                        }
                                                        target="_BLANK"
                                                    >
                                                        <img
                                                            className="tw-aspect-square tw-w-4/6 tw-rounded-lg"
                                                            src={
                                                                appConfig.baseURL +
                                                                "/storage/images/" +
                                                                row.image
                                                            }
                                                        />
                                                    </a>
                                                </td>
                                                <td>{row.name_gallery}</td>
                                                <td>
                                                    {row.description_gallery}
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(row.id)
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
                                                                row.id
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
                        {/* Pagination and showing data */}
                        <div className="d-flex justify-content-between align-items-center mt-4 p-3 table-responsive">
                            <div>
                                Showing {(currentPage - 1) * showing + 1} to{" "}
                                {Math.min(currentPage * showing, totalRows)} of{" "}
                                {totalRows} results
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
                            <h5 className="modal-title" id="formDataModalLabel">
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
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="image">Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name_gallery">
                                        Name Gallery
                                    </label>
                                    <input
                                        type="text"
                                        name="name_gallery"
                                        id="name_gallery"
                                        className={`form-control ${
                                            formErrors.name_gallery
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        value={formData.name_gallery || ""}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.name_gallery && (
                                        <div className="invalid-feedback">
                                            {formErrors.name_gallery}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description_gallery">
                                        Description
                                    </label>
                                    <textarea
                                        name="description_gallery"
                                        id="description_gallery"
                                        className="form-control"
                                        style={{ height: 100 }}
                                        value={
                                            formData.description_gallery || ""
                                        }
                                        onChange={handleInputChange}
                                    ></textarea>
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
