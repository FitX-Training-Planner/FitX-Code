import { useState } from "react";
import { getErrorMessageFromError } from "../utils/requests/errorMessage";
import { useSystemMessage } from "../app/SystemMessageProvider";
import { useLocation, useNavigate } from "react-router-dom";

export default function useRequest() {
    const navigate = useNavigate();
    
    const location = useLocation();

    const { notify } = useSystemMessage();

    const [loading, setLoading] = useState(false);

    async function request(requestFn, handleSuccess, handleError, loadingMessage, successMessage, errorMessage) {
        if (loading) return;

        if (!navigator.onLine) {
            notify("Você está offline! Verifique sua conexão.", "error", "network");

            return;
        }

        const requestId = `request-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        setLoading(true);

        notify(loadingMessage, "loading", requestId);

        try {
            const resp = await requestFn();

            handleSuccess(resp.data);

            notify(successMessage, "success", requestId);
        } catch (err) {
            console.error(err);

            if (!err.response) {
                notify("Você está offline! Verifique sua conexão.", "error", "network");

                setLoading(false);
                
                return;
            }

            if (err.response.status === 401) {
                if (location.pathname !== "/login") {                    
                    navigate("/login");
                }
            }

            handleError(err);

            notify(errorMessage, "error");
            
            notify(getErrorMessageFromError(err), "error", requestId);
        } finally {
            setLoading(false);
        }
    }

    return { request };
}
