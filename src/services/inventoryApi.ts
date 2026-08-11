import api from "./api";

export const getInventory = async () => {
    const response = await api.get("/inventory");
    return response.data;
};

export const getPharmacyInventory = async (pharmacyId: number) => {
    const response = await api.get(
        `/inventory/pharmacy/${pharmacyId}`
    );

    return response.data;
};

export const addInventory = async (data: any) => {
    const response = await api.post(
        "/inventory",
        data
    );

    return response.data;
};

export const updateInventory = async (
    id: number,
    data: any
) => {
    const response = await api.put(
        `/inventory/${id}`,
        data
    );

    return response.data;
};

export const deleteInventory = async (id: number) => {
    const response = await api.delete(
        `/inventory/${id}`
    );

    return response.data;
};