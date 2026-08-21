import axios from "axios";

const api = axios.create({
    baseURL: "https://medifind-bd.onrender.com/api"
});

export default api;