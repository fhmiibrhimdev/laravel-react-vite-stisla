import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Case from "@/components/Case";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useForm } from "@/hooks/useForm";
import { usePagination } from "@/hooks/usePagination";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { validateForm } from "@/utils/validation";
import { toast } from "@/utils/toast";
import InputValidation from "@/pages/Layout/Components/InputValidation";
import TextareaValidation from "@/pages/Layout/Components/TextareaValidation";
import Pagination from "@/pages/Layout/Components/Pagination";
import AddButton from "@/pages/Layout/Components/AddButton";
import SearchEntries from "@/pages/Layout/Components/SearchEntries";
import ModalFooter from "@/pages/Layout/Components/ModalFooter";
import ModalHeader from "@/pages/Layout/Components/ModalHeader";

const INITIAL_VALUES = { name: "", description: "", price: "" };

const VALIDATION_RULES = {
    name: { required: "Name is required" },
    description: { required: "Description is required" },
    price: {
        required: "Price is required",
        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Price is invalid" },
    },
};

export default function Product() {
    useDocumentTitle("Products");
    const navigate = useNavigate();

    // ─── Pagination & Search ─────────────────────────────────────────────
    const pagination = usePagination();

    // ─── TanStack Query ──────────────────────────────────────────────────
    const {
        data: productData,
        isLoading,
        isError,
    } = useProducts({
        page: pagination.currentPage,
        perPage: pagination.perPage,
        search: pagination.debouncedSearch,
    });

    const rows = productData?.data ?? [];
    const totalPages = productData?.last_page ?? 1;
    const totalRows = productData?.total ?? 0;

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    // ─── Form & Modal State ──────────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { formData, errors, handleChange, isValid, reset, setValues } = useForm(INITIAL_VALUES, (data) => validateForm(data, VALIDATION_RULES));

    const isMutating = createMutation.isPending || updateMutation.isPending;

    // ─── Handlers ────────────────────────────────────────────────────────
    const handleAdd = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
    };

    const handleEdit = (row) => {
        setIsEditing(true);
        setEditId(row.id);
        setValues({
            name: row.name,
            description: row.description,
            price: row.price,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid()) return;

        const onSuccess = () => {
            $(".modal").modal("hide");
            reset();
        };

        if (isEditing) {
            updateMutation.mutate({ id: editId, data: formData }, { onSuccess });
        } else {
            createMutation.mutate(formData, { onSuccess });
        }
    };

    const handleConfirmDelete = async (id) => {
        const result = await toast.confirmDelete();
        if (result.isConfirmed) {
            deleteMutation.mutate(id);
        }
    };

    // ─── Error handling for 403 ──────────────────────────────────────────
    if (isError) {
        navigate("/403");
        return null;
    }

    // ─── Loading ─────────────────────────────────────────────────────────
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
            </div>

            <div className="section-body">
                <div className="card">
                    <h3>Table Products</h3>
                    <div className="card-body px-0">
                        <SearchEntries showing={pagination.perPage} handleShow={pagination.handlePerPageChange} searchTerm={pagination.search} handleSearch={pagination.handleSearch} />
                        <div className="table-responsive">
                            <table className="tw-table-auto">
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
                                    {rows.length > 0 ? (
                                        rows.map((row, index) => (
                                            <tr key={row.id}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>{row.name}</td>
                                                <td>{row.description}</td>
                                                <td>{row.price}</td>
                                                <td className="text-center">
                                                    <button onClick={() => handleEdit(row)} className="btn btn-primary mr-2" data-toggle="modal" data-target="#formDataModal">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button onClick={() => handleConfirmDelete(row.id)} className="btn btn-danger">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No data available in the table
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={pagination.currentPage} showing={pagination.perPage} totalRows={totalRows} totalPages={totalPages} handlePageChange={pagination.handlePageChange} />
                    </div>
                </div>
                <AddButton handleAdd={handleAdd} />
            </div>

            {/* Modal */}
            <div className="modal fade" id="formDataModal" aria-labelledby="formDataModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <ModalHeader isEditing={isEditing} />
                        <form onSubmit={handleSubmit}>
                            <div class="modal-body">
                                <InputValidation label="Product name" name="name" type="text" value={formData.name} onChange={handleChange} error={errors.name} />
                                <TextareaValidation label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />
                                <InputValidation label="Price" name="price" type="number" value={formData.price} onChange={handleChange} error={errors.price} />
                            </div>
                            <ModalFooter isSubmitting={isMutating} />
                        </form>
                    </div>
                </div>
            </div>
        </Case>
    );
}
