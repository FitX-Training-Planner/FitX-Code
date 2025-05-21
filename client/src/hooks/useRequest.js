import toast from "react-hot-toast";
import { useLoading } from "../app/LoadingProvider";

export default function useRequest() {
    const { setLoading } = useLoading();

    async function request(request, handleSuccess, handleError) {
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
                    loading: "Carregando...",
                    success: "Operação concluída!",
                    error: "A operação falhou! Tente novamente.",
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
