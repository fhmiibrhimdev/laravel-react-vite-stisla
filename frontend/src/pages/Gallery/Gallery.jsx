import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Case from "@/components/Case";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useForm } from "@/hooks/useForm";
import { usePagination } from "@/hooks/usePagination";
import { useGallery, useCreateGallery, useUpdateGallery, useDeleteGallery } from "@/hooks/useGallery";
import { validateForm } from "@/utils/validation";
import { toast } from "@/utils/toast";
import InputValidation from "@/pages/Layout/Components/InputValidation";
import TextareaValidation from "@/pages/Layout/Components/TextareaValidation";
import Pagination from "@/pages/Layout/Components/Pagination";
import AddButton from "@/pages/Layout/Components/AddButton";
import SearchEntries from "@/pages/Layout/Components/SearchEntries";
import ModalFooter from "@/pages/Layout/Components/ModalFooter";
import ModalHeader from "@/pages/Layout/Components/ModalHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";
const INITIAL_VALUES = {
    name_gallery: "",
    description_gallery: "",
    image: null,
};

const VALIDATION_RULES = {
    name_gallery: { required: "Name gallery is required" },
};

export default function Gallery() {
    useDocumentTitle("Gallery");
    const navigate = useNavigate();

    // ─── Pagination & Search ─────────────────────────────────────────────
    const pagination = usePagination();

    // ─── TanStack Query ──────────────────────────────────────────────────
    const {
        data: galleryData,
        isLoading,
        isError,
    } = useGallery({
        page: pagination.currentPage,
        perPage: pagination.perPage,
        search: pagination.debouncedSearch,
    });

    const rows = galleryData?.data ?? [];
    const totalPages = galleryData?.last_page ?? 1;
    const totalRows = galleryData?.total ?? 0;

    const createMutation = useCreateGallery();
    const updateMutation = useUpdateGallery();
    const deleteMutation = useDeleteGallery();

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
            name_gallery: row.name_gallery,
            description_gallery: row.description_gallery,
            image: null,
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

    if (isError) {
        navigate("/403");
        return null;
    }

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
                    <h3>Table Gallery</h3>
                    <div className="card-body px-0">
                        <SearchEntries showing={pagination.perPage} handleShow={pagination.handlePerPageChange} searchTerm={pagination.search} handleSearch={pagination.handleSearch} />
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
                                    {rows.length > 0 ? (
                                        rows.map((row, index) => (
                                            <tr key={row.id}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>
                                                    <a href={`${BASE_URL}/storage/images/${row.image}`} target="_blank" rel="noopener noreferrer">
                                                        <img className="tw-aspect-square tw-w-4/6 tw-rounded-lg" src={`${BASE_URL}/storage/images/${row.image}`} alt={row.name_gallery} />
                                                    </a>
                                                </td>
                                                <td>{row.name_gallery}</td>
                                                <td>{row.description_gallery}</td>
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
                                            <td colSpan="5" className="text-center">
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
                <div className="modal-dialog">
                    <div className="modal-content">
                        <ModalHeader isEditing={isEditing} />
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="image">Image</label>
                                    <input type="file" name="image" id="image" className="form-control" onChange={handleChange} />
                                </div>
                                <InputValidation label="Name Gallery" name="name_gallery" type="text" value={formData.name_gallery} onChange={handleChange} error={errors.name_gallery} />
                                <TextareaValidation label="Description" name="description_gallery" value={formData.description_gallery} onChange={handleChange} error={errors.description_gallery} />
                            </div>
                            <ModalFooter isSubmitting={isMutating} />
                        </form>
                    </div>
                </div>
            </div>
        </Case>
    );
}
