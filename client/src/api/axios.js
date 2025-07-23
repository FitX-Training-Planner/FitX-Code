import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const code = error.response?.data?.message;

    if (status === 401 && code === "INVALID_TOKEN" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/token/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (err) {
        console.error(err);

        // window.location.href = "/login";
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
