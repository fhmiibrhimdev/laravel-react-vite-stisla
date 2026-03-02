import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/services/api";
import { toast } from "@/utils/toast";

const PRODUCTS_KEY = "products";

/**
 * Fetch paginated products list.
 */
export function useProducts({ page = 1, perPage = 10, search = "" } = {}) {
    return useQuery({
        queryKey: [PRODUCTS_KEY, { page, perPage, search }],
        queryFn: async () => {
            const { data } = await productApi.getAll({
                page,
                per_page: perPage,
                search,
                showing: perPage,
            });
            return data.data; // { data: [...], last_page, total, ... }
        },
        placeholderData: (previousData) => previousData,
    });
}

/**
 * Create a new product.
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => productApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            toast.success("Data created successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}

/**
 * Update an existing product.
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => productApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            toast.success("Data updated successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}

/**
 * Delete a product.
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => productApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            toast.success("Data deleted successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}

/**
 * Store multiple products at once.
 */
export function useCreateMultipleProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (inputs) => productApi.multipleStore(inputs),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            toast.success("Data created successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Something went wrong."
            );
        },
    });
}
