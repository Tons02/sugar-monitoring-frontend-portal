import axios from "axios";

const ENDPOINT = import.meta.env.VITE_SUGAR_MONITORING_ENDPOINT;
const API = axios.create({
    baseURL:ENDPOINT,
    headers: {
        "Content-Type":"application/json"
    }
})

export default API;