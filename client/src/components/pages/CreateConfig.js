import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";
import useRequest from "../../hooks/useRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { setUser } from "../../slices/user/userSlice";
import { useDispatch } from "react-redux";
import authUser from "../../utils/requests/auth";
import api from "../../api/axios";
import { Helmet } from "react-helmet";

function CreateConfig() {
    const location = useLocation();

    const navigate = useNavigate();

    const hasRun = useRef(false);

    const dispatch = useDispatch();

    const { notify } = useSystemMessage();
    const { request: postUserRequest } = useRequest();
    const { request: authRequest } = useRequest();

    const defaultConfig = useMemo(() => ({
        is_dark_theme: false,
        is_complainter_anonymous: true,
        is_rater_anonymous: false,
        email_notification_permission: true,
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

        postUserFormData.append("name", localUser.name);
        postUserFormData.append("email", localUser.email);
        postUserFormData.append("password", localUser.password);
        postUserFormData.append("isDarkTheme", config.is_dark_theme);
        postUserFormData.append("isComplainterAnonymous", config.is_complainter_anonymous);
        postUserFormData.append("isRaterAnonymous", config.is_rater_anonymous);
        postUserFormData.append("emailNotificationPermission", config.email_notification_permission);
        postUserFormData.append("isEnglish", config.is_english);
        postUserFormData.append("photoFile", config.photoFile);
        
        const postUser = () => {
            return api.post("/users", postUserFormData);
        };

        const handleOnPostUserSuccess = (data) => {
            authUser(data.userID, dispatch, navigate, notify, authRequest, setUser, true);
        }

        postUserRequest(postUser, handleOnPostUserSuccess, () => undefined, "Criando usuário", "Usuário criado!", "Falha ao criar usuário!");
    }, [authRequest, config, dispatch, localUser, navigate, notify, postUserRequest]);

    return (
        <main>
            <Helmet>
                <title>Criar Configuração</title>
            </Helmet>

            <ConfigForm
                config={config}
                setConfig={setConfig}
                handleSubmit={handleOnSubmit}
                handleChangeToTrainer={() => 
                    navigate("/create-trainer", { state: { localUser: { ...localUser, config } } })
                }
            />
        </main>
    );
}

export default CreateConfig;