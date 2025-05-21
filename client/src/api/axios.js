import axios from "axios";
import history from "../history";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
  withCredentials: true
});

api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    const isUnauthorized = err.response?.status === 401;
    const isNotOnLoginPage = window.location.pathname !== "/login";

    if (isUnauthorized && isNotOnLoginPage) history.push("/login");
    
    return Promise.reject(err);
  }
);

export default api;