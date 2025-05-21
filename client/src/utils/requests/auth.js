import routes from "shared/apiRoutes.json";
import api from "../../api/axios";
import { getErrorMessageFromError } from "./errorMessage";

export default function authUser(ID, dispatch, navigate, notify, authRequest, setUser) {
    const formData = new FormData();

    formData.append(routes.auth.formData.userID, ID);

    const postAuth = () => {
        api.post(routes.auth.endPoint, formData);
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

    authRequest(postAuth, handleOnAuthSuccess, handleOnAuthError);
};