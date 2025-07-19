import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";
import useRequest from "../../hooks/useRequest";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import { setUser } from "../../slices/user/userSlice";
import { useDispatch } from "react-redux";
import authUser from "../../utils/requests/auth";
import api from "../../api/axios";
import { useTranslation } from "react-i18next";

function CreateConfig() {
    const { t } = useTranslation();

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
            
            notify(t("notFoundUserInfo"), "error");

            return;
        }

        setLocalUser(locationUser);
    }, [location.state, navigate, notify, t]);
    
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

        postUserRequest(
            postUser, 
            handleOnPostUserSuccess, 
            () => undefined, 
            t("loadingCreateUser"), 
            undefined, 
            t("errorCreateUser")
        );
    }, [authRequest, config.email_notification_permission, config.is_complainter_anonymous, config.is_dark_theme, config.is_english, config.is_rater_anonymous, config.photoFile, dispatch, localUser.email, localUser.name, localUser.password, navigate, notify, postUserRequest, t]);

    useEffect(() => {
        document.title = t("configs");
    }, [t]);

    return (
        <main>
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