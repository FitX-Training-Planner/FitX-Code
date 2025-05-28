import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";
import useRequest from "../../hooks/useRequest";
import ROUTES from "../../api/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { setUser } from "../../slices/user/userSlice";
import { useDispatch } from "react-redux";
import authUser from "../../utils/requests/auth";
import { getErrorMessageFromError } from "../../utils/requests/errorMessage";
import api from "../../api/axios";

function CreateConfig() {
    const location = useLocation();

    const navigate = useNavigate();

    const hasRun = useRef(false);

    const dispatch = useDispatch();

    const { notify } = useSystemMessage();
    const { request: postUserRequest } = useRequest();
    const { request: authRequest } = useRequest();

    const defaultConfig = useMemo(() => ({
        is_client: true,
        is_dark_theme: false,
        is_complainter_anonymous: true,
        is_rater_anonymous: false,
        email_notification_permission: true,
        device_notification_permission: true,
        is_english: false,
        photoFile: null,
        photoBlobUrl: null
    }), []);

    const [localUser, setLocalUser] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [config, setConfig] = useState(defaultConfig);

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;

        const locationUser = location.state?.localUser;

        if (!locationUser) {
            navigate("/login");
            
            notify("As suas informações de usuário não foram encontradas. Tente se registrar novamente.", "error");

            return;
        }

        setLocalUser(locationUser);
    }, [location.state, navigate, notify]);
    
    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        const postUserFormData = new FormData();

        postUserFormData.append(ROUTES.user.formData.name, localUser.name);
        postUserFormData.append(ROUTES.user.formData.email, localUser.email);
        postUserFormData.append(ROUTES.user.formData.password, localUser.password);
        postUserFormData.append(ROUTES.user.formData.isClient, config.is_client);
        postUserFormData.append(ROUTES.user.formData.isDarkTheme, config.is_dark_theme);
        postUserFormData.append(ROUTES.user.formData.isComplainterAnonymous, config.is_complainter_anonymous);
        postUserFormData.append(ROUTES.user.formData.isRaterAnonymous, config.is_rater_anonymous);
        postUserFormData.append(ROUTES.user.formData.emailNotificationPermission, config.email_notification_permission);
        postUserFormData.append(ROUTES.user.formData.deviceNotificationPermission, config.device_notification_permission);
        postUserFormData.append(ROUTES.user.formData.isEnglish, config.is_english);
        postUserFormData.append(ROUTES.user.formData.photoFile, config.photoFile);
        
        const postUser = () => {
            api.post(ROUTES.user.endPoint, postUserFormData);
        };

        const handleOnPostUserSuccess = (data) => {
            authUser(data.userID, dispatch, navigate, notify, authRequest, setUser, true);
        }

        const handleOnPostUserError = (err) => {
            notify(getErrorMessageFromError(err), "error");
        }

        postUserRequest(postUser, handleOnPostUserSuccess, handleOnPostUserError, "Criando usuário", "Usuário criado!", "Falha ao criar usuário!");
    }, [authRequest, config, dispatch, localUser, navigate, notify, postUserRequest]);

    return (
        <main>
            <ConfigForm
                config={config}
                setConfig={setConfig}
                handleSubmit={handleOnSubmit}
                handleChangeToTrainer={() => 
                    navigate("/create-trainer", { state: { localUser: { ...localUser, config: { ...config, is_client: false } } } })
                }
            />
        </main>
    );
}

export default CreateConfig;