/**
 * axios setup to use mock service
 */

import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import JWTContext, {getAccessToken} from "../contexts/JWTContext";

const berryAxios = axios.create({ baseURL: 'https://mock-data-api-nextjs.vercel.app/'});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

export default berryAxios;

export const fetcher = async (args) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await berryAxios.get(url, { ...config });

    return res.data;
};
