import { useCallback, useState } from "react";
import { getErrorMessageCodeError } from "../utils/requests/errorMessage";
import { useSystemMessage } from "../app/useSystemMessage";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function useRequest() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const location = useLocation();

    const { notify } = useSystemMessage();

    const [loading, setLoading] = useState(false);

    const notifyErrorMessage = useCallback((err, errorMessage, requestId) => {
        if (errorMessage) notify(errorMessage, "error");

        const messageError = getErrorMessageCodeError(err)
        
        if (messageError) notify(t(messageError), "error", requestId);
    }, [notify, t]);

    const refreshToken = useCallback(async (requestId) => {
        try {
            await api.post("/token/refresh");

            return true;
        } catch (err) {
            console.error(err);

            notifyErrorMessage(err, undefined, requestId)

            navigate("/login");

            return false;
        }
    }, [navigate, notifyErrorMessage])

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

            if (successMessage) notify(successMessage, "success", `${requestId}success`);
        } catch (err) {
            console.error(err);

            toast.dismiss(requestId);

            if (!err.response) {
                notify(t("errorConnection"), "error", "network");

                setLoading(false);
                
                return;
            }

            const status = err?.response?.status;
            const currentPath = location.pathname;
            const code = err.response?.data?.message;

            if (status === 401 && code === "INVALID_TOKEN" && err.config && !err.config._retry) {
                err.config._retry = true;

                const refreshed = await refreshToken(requestId);

                if (refreshed) {
                    try {
                        const retryResp = await api(err.config);

                        handleSuccess(retryResp.data);

                        if (successMessage) notify(successMessage, "success", `${requestId}success`);

                        return;
                    } catch (retryErr) {
                        console.error(retryErr);

                        notifyErrorMessage(retryErr, errorMessage, `${requestId}error`);

                        handleError(retryErr);
                        
                        return;
                    }
                }

                return;
            }

            if (status === 403) {
                if (currentPath !== "/") navigate("/");
                
                notify(t("errorAccess"), "error");
                
                return;
            }
            
            notifyErrorMessage(err, errorMessage, `${requestId}error`);
            
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    return { request, loading };
}
