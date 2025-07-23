import api from "../../api/axios";

export default function authUser(ID, dispatch, navigate, authRequest, setUser, isClient, t) {    
    const formData = new FormData();

    formData.append("ID", ID);
    formData.append("isClient", isClient);

    const postAuth = () => {
        return api.post("/auth", formData);
    };

    const handleOnAuthSuccess = (data) => {
        dispatch(setUser(data));

        navigate("/");
    };

    const handleOnAuthError = () => {
        navigate("/login");
    };

    authRequest(
        postAuth, 
        handleOnAuthSuccess, 
        handleOnAuthError, 
        t("loadingAuth"), 
        t("successAuth"), 
        t("errorAuth")
    );
};
