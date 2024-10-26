import axios from 'axios';

import { CONFIG } from 'src/config-global';

import { setSession, getAccessToken, getRefreshToken } from './token.service';

const AxiosInstance = axios.create({
    baseURL: `${CONFIG.serverUrl}/api`,
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        console.log("🚀 ~ accessToken:", accessToken);
        const unAuthorizeUrls = ['/auth/sign-in'];

        if (accessToken && config.url && !unAuthorizeUrls.includes(config.url)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log("🚀 ~ config:", config);
        return config;
    },
    (error) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${CONFIG.serverUrl}/auth/refresh`, {
                        refreshToken,
                    });

                    setSession(data);

                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    return AxiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token expired, please login again');
                }
            }
        }

        return Promise.reject(error);
    }
);

export const GET = (url, config) => AxiosInstance.get(url, config);

export const POST = (url, body, config) => AxiosInstance.post(url, body, config);

export const PATCH = (url, body) => AxiosInstance.patch(url, body);

export const PUT = (url, body) => AxiosInstance.put(url, body);

export const DELETE = (url, config) => AxiosInstance.delete(url, config);

export default AxiosInstance;
