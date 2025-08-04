import styles from "./CodeConfirmation.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import CodeConfirmationForm from "../form/forms/CodeConfirmationForm";
import Title from "../text/Title";
import Stack from "../containers/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/useSystemMessage";
import useRequest from "../../hooks/useRequest";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { useConfirmIdentityCallback } from "../../app/useConfirmIdentityCallback";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/user/userSlice";
import api from "../../api/axios";
import { validateCodeRequestData } from "../../utils/validators/formValidator";
import { useTranslation } from "react-i18next";

function CodeConfirmation() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const location = useLocation();

    const dispatch = useDispatch();

    const { notify } = useSystemMessage();
    const { handleOnConfirmed } = useConfirmIdentityCallback();
    const { request: generateCodeRequest } = useRequest();
    const { request: confirmIdentityRequest } = useRequest();
    const { request: authRequest } = useRequest();

    const [code, setCode] = useState([
        { value: "", order: 1 },
        { value: "", order: 2 },
        { value: "", order: 3 },
        { value: "", order: 4 }
    ]);    
    const [localUser, setLocalUser] = useState({
        ID: null,
        email: ""
    });    
    const [origin, setOrigin] = useState("login");
    const [error, setError] = useState(false);

    const generateCode = useCallback(email => {
        const generateCodeFormData = new FormData();

        generateCodeFormData.append("email", email);

        const postGenerateCode = () => {
            return api.post("/identity-confirmation", generateCodeFormData);
        }         

        generateCodeRequest(
            postGenerateCode, 
            () => undefined, 
            () => undefined, 
            t("loadingSendCode"), 
            t("successSendCode"), 
            t("errorSendCode")
        );
    }, [generateCodeRequest, t]);    

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;
    
        const locationUser = location.state?.localUser;
        const locationOrigin = location.state?.origin;

        if (!locationUser || !locationOrigin) {
            navigate("/login");
            
            notify(t("notFoundContactInfo"), "error");

            return;
        }

        setLocalUser(locationUser);

        setOrigin(locationOrigin);

        generateCode(locationUser.email);
    }, [generateCode, location.state, navigate, notify, t]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateCodeRequestData(error, setError, code)) return;

        const confirmCodeFormData = new FormData();

        confirmCodeFormData.append("email", localUser.email);

        const formattedCode = code.map(unit => unit.value).join("");

        confirmCodeFormData.append("code", formattedCode);

        const postConfirmCode = () => {
            return api.post("/identity-confirmation", confirmCodeFormData);
        }

        const handleOnConfirmCodeSuccess = () => {
            if (origin === "login") {
                handleOnConfirmed(localUser.ID, dispatch, navigate, authRequest, setUser);
            } else if (origin === "signUp") {
                handleOnConfirmed();
            } else if (origin === "recoverPassword") {
                handleOnConfirmed();
            } else if (origin === "deleteAccount") {
                handleOnConfirmed();
            } else if (origin === "modifyEmail") {
                handleOnConfirmed();
            }
        }

        const handleOnConfirmCodeError = () => {
            setError(true);
        }

        confirmIdentityRequest(
            postConfirmCode, 
            handleOnConfirmCodeSuccess, 
            handleOnConfirmCodeError, 
            t("loadingSendCode"), 
            t("successConfirmIdentity"), 
            t("errorConfirmIdentity")
        );
    }, [error, code, localUser.email, localUser.ID, confirmIdentityRequest, t, origin, handleOnConfirmed, dispatch, navigate, authRequest]);

    useEffect(() => {
        document.title = t("confirmIdentity");
    }, [t]);

    return (
        <main
            className={styles.code_confirmation_page}
        >
            <Stack
                gap="2em"
            >
                <Title
                    headingNumber={1}
                    text={t("confirmIdentity")}
                />

                <CodeConfirmationForm
                    code={code}
                    setCode={setCode}
                    handleSubmit={handleOnSubmit}
                    email={localUser.email}
                    setError={setError}
                />

                <NonBackgroundButton
                    text={t("resendCode")}
                    handleClick={() => generateCode(localUser.email)}
                    varColor="--theme-color"
                />
            </Stack>
        </main>
    );
}

export default CodeConfirmation;