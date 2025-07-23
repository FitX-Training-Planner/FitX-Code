import { useState } from "react";
import { getErrorMessageCodeError } from "../utils/requests/errorMessage";
import { useSystemMessage } from "../app/useSystemMessage";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function useRequest() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const location = useLocation();

    const { notify } = useSystemMessage();

    const [loading, setLoading] = useState(false);

    async function request(requestFn, handleSuccess, handleError, loadingMessage, successMessage, errorMessage) {
        if (loading) return;

        if (!navigator.onLine) {
            notify(t("errorConnection"), "error", "network");

            return;
        }

        const requestId = `request-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        setLoading(true);

        if (loadingMessage) notify(loadingMessage, "loading", requestId);

        try {
            const resp = await requestFn();

            handleSuccess(resp.data);

            toast.dismiss(requestId);

            if (successMessage) notify(successMessage, "success", requestId);
        } catch (err) {
            console.error(err);

            toast.dismiss(requestId);

            if (!err.response) {
                notify(t("errorConnection"), "error", "network");

                setLoading(false);
                
                return;
            }

            if (errorMessage) notify(errorMessage, "error");

            const messageError = getErrorMessageCodeError(err)
            
            if (messageError) notify(t(messageError), "error", requestId);

            const status = err?.response?.status;
            const currentPath = location.pathname;

            if (status === 403) {
                if (currentPath !== "/") navigate("/");

                notify(t("errorAccess"), "error");

                return;
            }
            
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    return { request, loading };
}
