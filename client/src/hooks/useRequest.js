import { useState } from "react";
import { getErrorMessageFromError } from "../utils/requests/errorMessage";
import { useSystemMessage } from "../app/SystemMessageProvider";

export default function useRequest() {
    const { notify } = useSystemMessage();

    const [loading, setLoading] = useState(false);

    async function request(requestFn, handleSuccess, handleError, loadingMessage, successMessage, errorMessage) {
        if (loading) return;

        setLoading(true);

        notify(loadingMessage, "loading", "request");

        try {
            const resp = await requestFn();

            handleSuccess(resp.data);

            notify(successMessage, "success", "request");
        } catch (err) {
            console.error(err);

            handleError(err);

            notify(errorMessage, "error");
            
            notify(getErrorMessageFromError(err), "error", "request");
        } finally {
            setLoading(false);
        }
    }

    return { request };
}
