import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/services/api";
import { toast } from "@/utils/toast";

const PROFILE_KEY = "profile";

export function useProfile() {
    return useQuery({
        queryKey: [PROFILE_KEY],
        queryFn: async () => {
            const { data } = await profileApi.get();
            return data.data;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => profileApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROFILE_KEY] });
            queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
            toast.success("Profile updated successfully");
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
}

export function useUpdatePassword() {
    return useMutation({
        mutationFn: (data) => profileApi.updatePassword(data),
        onSuccess: () => {
            toast.success("Password updated successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Something went wrong."
            );
        },
    });
}
