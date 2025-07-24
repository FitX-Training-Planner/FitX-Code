import styles from "./CodeConfirmation.module.css";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import { useConfirmIdentityCallback } from "../../app/useConfirmIdentityCallback";
import api from "../../api/axios";
import { useTranslation } from "react-i18next";
import RecoverPasswordForm from "../form/forms/RecoverPasswordForm";
import { validateLoginRequestData } from "../../utils/validators/formValidator";
import { useSystemMessage } from "../../app/useSystemMessage";

function RecoverPassword() {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const { notify } = useSystemMessage();
        
    const { setHandleOnConfirmed } = useConfirmIdentityCallback();

    const { request: recoverPasswordRequest } = useRequest();

    const [account, setAccount] = useState({
        email: "",
        newPassword: ""
    });
    const [recoverPasswordError, setRecoverPasswordError] = useState(false);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();
    
        if (!validateLoginRequestData(recoverPasswordError, setRecoverPasswordError, account.email, account.newPassword)) return;
    
        const formData = new FormData();
    
        formData.append("email", account.email);
        formData.append("newPassword", account.newPassword);
    
        const postRecoverPassword = () => {
            return api.post("/recover-password", formData);
        }
        
        const handleOnRecoverPasswordSuccess = () => {
            navigate("/code-confirmation", { state: { localUser: { email: account.email }, origin: "recoverPassword" } });

            setHandleOnConfirmed(() => () => {
                navigate("/login");

                notify(t("successRecoverPassword"));
            });
        };
        
        recoverPasswordRequest(
            postRecoverPassword, 
            handleOnRecoverPasswordSuccess, 
            () => undefined, 
            t("loadingCheckData"), 
            undefined, 
            t("errorRecoverPassword")
        );
    }, [account.email, account.newPassword, navigate, recoverPasswordError, recoverPasswordRequest, setHandleOnConfirmed, notify, t]);

    useEffect(() => {
        document.title = t("recoverPassword");
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
                    text={t("recoverPassword")}
                />
                
                <RecoverPasswordForm
                    account={account}
                    setAccount={setAccount}
                    setRecoverPasswordError={setRecoverPasswordError}
                    handleSubmit={handleOnSubmit}
                />
            </Stack>
        </main>
    );
}

export default RecoverPassword;
