import apiClient from "@/lib/axios";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
    login: (data) => apiClient.post("/login", data),
    register: (data) => apiClient.post("/register", data),
    logout: () => apiClient.post("/logout"),
    getUser: () => apiClient.get("/user"),
};

// ─── Products ────────────────────────────────────────────────────────────────

export const productApi = {
    getAll: (params) => apiClient.get("/products", { params }),
    create: (data) => apiClient.post("/products", data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    remove: (id) => apiClient.delete(`/products/${id}`),
    multipleStore: (data) =>
        apiClient.post("/products/multiple-store", { inputs: data }),
};

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const galleryApi = {
    getAll: (params) => apiClient.get("/gallery", { params }),
    create: (data) =>
        apiClient.post("/gallery", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined)
                formData.append(key, value);
        });
        formData.append("_method", "put");
        return apiClient.post(`/gallery/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    remove: (id) => apiClient.delete(`/gallery/${id}`),
};

// ─── Profile ─────────────────────────────────────────────────────────────────

export const profileApi = {
    get: () => apiClient.get("/profile"),
    update: (data) => apiClient.put("/profile", data),
    updatePassword: (data) => apiClient.put("/update-password", data),
};
