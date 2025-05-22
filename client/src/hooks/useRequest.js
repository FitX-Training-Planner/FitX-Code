import { useState } from "react";
import toast from "react-hot-toast";

export default function useRequest() {
    const [loading, setLoading] = useState(false);

    async function request(request, handleSuccess, handleError, loadingMessage, SuccessMessage, errorMessage) {
        if (loading) return;

        setLoading(true);

        const wrappedRequest = () => async () => {
            try {
                const resp = await request();

                handleSuccess(resp.data);
            } catch (err) {
                console.error(err);

                handleError(err);

                throw err; 
            }
        };

        try {
            await toast.promise(
                wrappedRequest(),
                {
                    loading: `${loadingMessage}...`,
                    success: SuccessMessage,
                    error: errorMessage
                },
                {
                    style: {
                        letterSpacing: "0.5px",
                        maxWidth: "30em",
                        textAlign: "justify"
                    },
                    position: "top-right"
                }
            );
        } finally {
            setLoading(false);
        }
    }

    return { request };
}
