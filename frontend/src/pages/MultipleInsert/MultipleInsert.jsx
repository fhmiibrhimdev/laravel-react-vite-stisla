import React from "react";
import Case from "../../components/Case";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import appConfig from "../../config/appConfig";
import Pagination from "../Layout/Components/Pagination";
import AddButton from "../Layout/Components/AddButton";
import SearchEntries from "../Layout/Components/SearchEntries";
import ModalFooter from "../Layout/Components/ModalFooter";
import InputValidation from "../Layout/Components/InputValidation";
import TextAreaValidation from "../Layout/Components/TextareaValidation";
import ModalHeader from "../Layout/Components/ModalHeader";

export default function MultipleInsert() {
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermDebounced, setSearchTermDebounced] = useState("");
    const [showing, setShowing] = useState(10);

    const [refetch, setRefetch] = useState(Math.random());

    useEffect(() => {
        document.title = "Products";
        axios
            .get(
                `${appConfig.baseurlAPI}/products?page=${currentPage}&per_page=${showing}&search=${searchTerm}&showing=${showing}`
            )
            .then((data) => {
                setRows(data.data.data.data);
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
     * Handle Add single data
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

    const handleAdd = () => {
        setModalData(null);
        setIsEditing(false);
        setFormData(initialFormData);
    };

    const handleEdit = (id) => {
        const data = rows.find((row) => row.id === id);
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
                    .post(`${appConfig.baseurlAPI}/products`, formData, {
                        headers: {
                            "Content-Type": "application/json",
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
        } else {
            if (validateForm()) {
                axios
                    .put(
                        `${appConfig.baseurlAPI}/products/${modalData.id}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "application/json",
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
            .delete(`${appConfig.baseurlAPI}/products/${id}`)
            .then((data) => {
                console.log("Success:", data);
                setRows(rows.filter((row) => row.id !== id));
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

    /**
     * Handle Add multiple data
     */

    const [inputs, setInputs] = useState([
        { name: "", description: "", price: "" },
    ]);

    const initialMultipleInputs = [
        {
            name: "",
            description: "",
            price: "",
        },
    ];

    const handleAddMultiple = () => {
        const newInput = { name: "", description: "", price: "" };
        setInputs([...inputs, newInput]);
    };

    const handleRemoveMultiple = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const handleSubmitMultiple = (event) => {
        event.preventDefault();

        axios
            .post(
                `${appConfig.baseurlAPI}/products/multiple-store`,
                { inputs: inputs },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
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
                        setInputs(initialMultipleInputs);
                    });
                } else {
                    throw new Error("Network response was not ok");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                MySwal.fire({
                    title: "Oops...",
                    html: error.response.data.message,
                    icon: "error",
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
                <h1 className="mb-1 tw-text-lg">Products</h1>
                <button
                    data-toggle="modal"
                    data-target="#formDataMultipleModal"
                    onClick={handleAdd}
                    className="btn btn-outline-primary ml-auto"
                >
                    Add Multiple
                </button>
            </div>

            <div className="section-body">
                <div className="card">
                    <div className="card-body px-0">
                        <h3>Table Products</h3>
                        <SearchEntries
                            showing={showing}
                            handleShow={handleShow}
                            searchTerm={searchTerm}
                            handleSearch={handleSearch}
                        />
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
                                    {Array.isArray(rows) && rows.length ? (
                                        rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    {index + 1}
                                                </td>
                                                <td>{row.name}</td>
                                                <td>{row.description}</td>
                                                <td>{row.price}</td>
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
                        <Pagination
                            currentPage={currentPage}
                            showing={showing}
                            totalRows={totalRows}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                        />
                        {/* Pagination and showing data */}
                    </div>
                </div>
                <AddButton handleAdd={handleAdd} />
            </div>

            <div
                className="modal fade"
                id="formDataMultipleModal"
                aria-labelledby="formDataMultipleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="formDataMultipleModalLabel"
                            >
                                {isEditing ? "Edit Data" : "Add Data"}
                            </h5>
                            <button type="button" onClick={handleAddMultiple}>
                                <span aria-hidden="true">
                                    <i className="fas fa-plus-square tw-text-2xl"></i>
                                </span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitMultiple}>
                            <div className="modal-body">
                                <table>
                                    <thead>
                                        <tr className="text-center">
                                            <th>Product name</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th width="12%">
                                                <i className="fas fa-cogs"></i>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inputs.map((input, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        value={input.name}
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            const newInputs = [
                                                                ...inputs,
                                                            ];
                                                            newInputs[
                                                                index
                                                            ].name =
                                                                e.target.value;
                                                            setInputs(
                                                                newInputs
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={
                                                            input.description
                                                        }
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            const newInputs = [
                                                                ...inputs,
                                                            ];
                                                            newInputs[
                                                                index
                                                            ].description =
                                                                e.target.value;
                                                            setInputs(
                                                                newInputs
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        value={input.price}
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            const newInputs = [
                                                                ...inputs,
                                                            ];
                                                            newInputs[
                                                                index
                                                            ].price =
                                                                e.target.value;
                                                            setInputs(
                                                                newInputs
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() =>
                                                            handleRemoveMultiple(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <ModalFooter />
                        </form>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="formDataModal"
                aria-labelledby="formDataModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <ModalHeader isEditing={isEditing} />
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <InputValidation
                                    label="Product name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={formErrors.name}
                                />
                                <TextAreaValidation
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    error={formErrors.description}
                                />
                                <InputValidation
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    error={formErrors.price}
                                />
                            </div>
                            <ModalFooter />
                        </form>
                    </div>
                </div>
            </div>
        </Case>
    );
}
