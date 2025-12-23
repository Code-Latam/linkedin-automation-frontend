import axios from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL, // example: http://localhost:4000/api
    //withCredentials: true,
    /*headers: {
        //CORS allow headers
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        //'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        //'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }*/
});
// Attach access token on each request
api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto refresh token if expired
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalReq = err.config;

        // Token expired
        if (err.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;

            try {
                const refreshToken = Cookies.get("refreshToken");

                const refreshRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );

                const { accessToken, refreshToken: newRefreshToken } = refreshRes.data;

                Cookies.set("accessToken", accessToken);
                Cookies.set("refreshToken", newRefreshToken);

                originalReq.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalReq);
            } catch (refreshErr) {
                console.error("Refresh failed:", refreshErr);
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                //window.location.href = "/login";
            }
        }

        return Promise.reject(err);
    }
);

export default api;
