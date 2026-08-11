import api from "./api";

export const getPharmacies = async () => {
    const response = await api.get("/pharmacies");
    return response.data;
};

export const getAllPharmacies = async () => {
    const response = await api.get("/pharmacies/all");
    return response.data;
};

export const getPharmacy = async (id: number) => {
    const response = await api.get(`/pharmacies/${id}`);
    return response.data;
};

export const createPharmacy = async (data: any) => {
    const response = await api.post("/pharmacies", data);
    return response.data;
};

export const approvePharmacy = async (id: number) => {
    const response = await api.put(`/pharmacies/${id}/approve`);
    return response.data;
};

export const rejectPharmacy = async (id: number) => {
    const response = await api.put(`/pharmacies/${id}/reject`);
    return response.data;
};