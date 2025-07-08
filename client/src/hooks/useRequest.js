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
            notify("Erro de conexão! Verifique sua conexão ou tente novamente.", "error", "network");

            return;
        }

        const requestId = `request-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        setLoading(true);

        if (loadingMessage) notify(loadingMessage, "loading", requestId);

        try {
            const resp = await requestFn();

            handleSuccess(resp.data);

            if (successMessage) notify(successMessage, "success", requestId);
        } catch (err) {
            console.error(err);

            if (!err.response) {
                notify("Você está offline! Verifique sua conexão.", "error", "network");

                setLoading(false);
                
                return;
            }

            if (errorMessage) notify(errorMessage, "error");
            
            notify(getErrorMessageFromError(err), "error", requestId);

            const status = err?.response?.status;
            const currentPath = location.pathname;

            if (status === 401) {
                if (currentPath !== "/login") navigate("/login");

                return;
            } else if (status === 403) {
                if (currentPath !== "/") navigate("/");

                notify("Falha ao acessar recurso!", "error");

                return;
            }
            
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    return { request, loading };
}
