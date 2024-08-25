/**
 * axios setup to use mock service
 */

import axios from 'axios';
import {getAccessToken} from "../contexts/JWTContext";

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
    async (config) => {
        const accessToken = getAccessToken();
        if (accessToken && !config.url.includes('/open/')) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 && !window.location.href.includes('/login')) {
            window.location.pathname = '/login';
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;
