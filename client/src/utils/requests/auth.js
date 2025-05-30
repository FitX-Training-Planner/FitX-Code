import api from "../../api/axios";

export default function authUser(ID, dispatch, navigate, notify, authRequest, setUser, isClient) {
    const formData = new FormData();

    formData.append("ID", ID);
    formData.append("isClient", isClient);

    const postAuth = () => {
        return api.post("/auth", formData);
    };

    const handleOnAuthSuccess = (data) => {
        dispatch(setUser(data));

        navigate("/");

        notify("Você foi autenticado com sucesso. Aproveite o FitX!");
    };

    const handleOnAuthError = () => {
        navigate("/login");
    };

    authRequest(postAuth, handleOnAuthSuccess, handleOnAuthError, "Autenticando", "Autenticado!", "Falha ao autenticar!");
};