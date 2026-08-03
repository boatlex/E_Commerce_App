import axios from "axios";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";

const API_URL = "https://ecommerceapp-o3n74.sevalla.app/api";
//const API_URL = "http://localhost:3000/api";
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const useApi = () => {
    const { getToken } = useAuth();
    
    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            try {
                const token = await getToken(); 
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Failed to fetch Clerk token:", error);
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [getToken]);
    return api;
};
