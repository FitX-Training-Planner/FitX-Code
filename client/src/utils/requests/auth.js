import ROUTES from "../../api/routes";
import api from "../../api/axios";
import { getErrorMessageFromError } from "./errorMessage";

export default function authUser(ID, dispatch, navigate, notify, authRequest, setUser, isClient) {
    const formData = new FormData();

    formData.append(ROUTES.auth.formData.ID, ID);
    formData.append(ROUTES.auth.formData.isClient, isClient);

    const postAuth = () => {
        api.post(ROUTES.auth.endPoint, formData);
    };

    const handleOnAuthSuccess = (data) => {
        dispatch(setUser(data));

        navigate("/");

        notify("Você foi autenticado com sucesso. Aproveite o FitX!");
    };

    const handleOnAuthError = (err) => {
        navigate("/login");

        notify(getErrorMessageFromError(err), "error");
    };

    authRequest(postAuth, handleOnAuthSuccess, handleOnAuthError, "Autenticando", "Autenticado!", "Falha ao autenticar!");
};