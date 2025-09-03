import { useEffect, useMemo, useRef, useState } from "react";
import ConfigForm from "../form/forms/ConfigForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

function CreateConfig() {
    const { t } = useTranslation();

    const location = useLocation();

    const navigate = useNavigate();

    const hasRun = useRef(false);

    const dispatch = useDispatch();

    const { notify } = useSystemMessage();

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
    
    useEffect(() => {
        document.title = t("configs");
    }, [t]);

    return (
        <main>
            <ConfigForm
                config={config}
                setConfig={setConfig}
                handleSubmit={(e) => {
                    e.preventDefault();
                    navigate("/create-client", { state: { localUser: { ...localUser, config } } })
                }}
                handleChangeToTrainer={() => 
                    navigate("/create-trainer", { state: { localUser: { ...localUser, config } } })
                }
            />
        </main>
    );
}

export default CreateConfig;