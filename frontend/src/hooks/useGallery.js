import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "@/services/api";
import { toast } from "@/utils/toast";

const GALLERY_KEY = "gallery";

export function useGallery({ page = 1, perPage = 10, search = "" } = {}) {
    return useQuery({
        queryKey: [GALLERY_KEY, { page, perPage, search }],
        queryFn: async () => {
            const { data } = await galleryApi.getAll({
                page,
                per_page: perPage,
                search,
                showing: perPage,
            });
            return data.data;
        },
        placeholderData: (previousData) => previousData,
    });
}

export function useCreateGallery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => galleryApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GALLERY_KEY] });
            toast.success("Data created successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}

export function useUpdateGallery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => galleryApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GALLERY_KEY] });
            toast.success("Data updated successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}

export function useDeleteGallery() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => galleryApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [GALLERY_KEY] });
            toast.success("Data deleted successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}
