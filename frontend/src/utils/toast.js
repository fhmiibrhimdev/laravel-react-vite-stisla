import Swal from "sweetalert2";

export const toast = {
    success: (text = "Operation successful") =>
        Swal.fire({ title: "Success!", text, icon: "success", timer: 1500 }),

    error: (text = "Something went wrong.") =>
        Swal.fire({ title: "Oops...", text, icon: "error", timer: 2000 }),

    confirmDelete: () =>
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }),
};
