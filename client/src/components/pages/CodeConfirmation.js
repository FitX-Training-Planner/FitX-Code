import styles from "./CodeConfirmation.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import CodeConfirmationForm from "../form/forms/CodeConfirmationForm";
import Title from "../text/Title";
import Stack from "../containers/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import useRequest from "../../hooks/useRequest";
import routes from "shared/apiRoutes.json";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { useConfirmIdentityCallback } from "../../app/ConfirmIdentityCallbackProvider";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/user/userSlice";
import { getErrorMessageFromError } from "../../utils/requests/errorMessage";
import api from "../../api/axios";

function CodeConfirmation() {
    const navigate = useNavigate();
    
    const hasRun = useRef(false);
    
    const location = useLocation();

    const dispatch = useDispatch();

    const { notify } = useSystemMessage();
    const { handleOnConfirmed } = useConfirmIdentityCallback();
    const { request: generateCodeRequest } = useRequest();
    const { request: authRequest } = useRequest();

    const [codes, setCodes] = useState({
        email: [
            {value: "", order: 1},
            {value: "", order: 2},
            {value: "", order: 3},
            {value: "", order: 4}
        ],    
        contact: [
            {value: "", order: 1},
            {value: "", order: 2},
            {value: "", order: 3},
            {value: "", order: 4}
        ]    
    });    
    const [localUser, setLocalUser] = useState({
        name: "",
        email: "",
        contact: "",
        password: ""
    });    
    const [origin, setOrigin] = useState("login");

    const generateCode = useCallback((email, contact) => {
        const generateCodeFormData = new FormData();

        generateCodeFormData.append(routes.identityConfirmation.formData.email, email);
        generateCodeFormData.append(routes.identityConfirmation.formData.contact, contact);

        const postGenerateCode = () => {
            api.post(routes.identityConfirmation.endPoint, generateCodeFormData);
        }    

        const handleOnGenerateCodeSuccess = () => {
            notify("Código enviado.");
        }    

        const handleOnGenerateCodeError = (err) => {
            notify(getErrorMessageFromError(err), "error");
        }    

        generateCodeRequest(postGenerateCode, handleOnGenerateCodeSuccess, handleOnGenerateCodeError);
    }, [generateCodeRequest, notify]);    

    useEffect(() => {
        if (hasRun.current) return;
        
        hasRun.current = true;
    
        const locationUser = location.state?.localUser;
        const locationOrigin = location.state?.origin;

        if (!locationUser || !locationOrigin) {
            navigate("/login");
            
            notify("As suas informações de contato não foram encontradas. Tente logar ou se registrar novamente.", "error");

            return;
        }

        setLocalUser(locationUser);

        setOrigin(locationOrigin);

        generateCode(locationUser.email, locationUser.contact);
    }, [generateCode, location.state, navigate, notify]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        const emailCodeEmpty = localUser.email && codes.email.some(unit => !unit.value);
        const contactCodeEmpty = localUser.contact && codes.contact.some(unit => !unit.value);

        if (emailCodeEmpty || contactCodeEmpty ) {
            notify("Preencha todos os campos de cógigo.", "error");

            return;
        }

        const confirmCodeFormData = new FormData();

        confirmCodeFormData.append(routes.identityConfirmation.formData.email, localUser.email);
        confirmCodeFormData.append(routes.identityConfirmation.formData.contact, localUser.contact);

        const emailCode = codes.email.map(unit => unit.value).join("");
        const contactCode = codes.contact.map(unit => unit.value).join("");

        confirmCodeFormData.append(routes.identityConfirmation.formData.emailCode, emailCode);
        confirmCodeFormData.append(routes.identityConfirmation.formData.contactCode, contactCode);

        const postGenerateCode = () => {
            api.post(routes.identityConfirmation.endPoint, confirmCodeFormData);
        }

        const handleOnConfirmCodeSuccess = () => {
            origin === "login" 
            ? handleOnConfirmed(localUser.ID, dispatch, navigate, notify, authRequest, setUser)
            : handleOnConfirmed();
        }

        const handleOnGenerateCodeError = (err) => {
            notify(getErrorMessageFromError(err), "error");
        }

        generateCodeRequest(postGenerateCode, handleOnConfirmCodeSuccess, handleOnGenerateCodeError);
    }, [authRequest, codes, dispatch, generateCodeRequest, handleOnConfirmed, localUser.ID, localUser.contact, localUser.email, navigate, notify, origin]);

    return (
        <main
            className={styles.code_confirmation_page}
        >
            <Stack
                className={styles.code_confirmation_container}
            >
                <Title
                    headingNumber={1}
                    text="Confirmação de Identidade"
                />

                <CodeConfirmationForm
                    codes={codes}
                    setCodes={setCodes}
                    handleSubmit={handleOnSubmit}
                    email={localUser.email}
                    contact={localUser.contact}
                />

                <NonBackgroundButton
                    text="Reenviar Código"
                    handleClick={generateCode}
                    varColor="--theme-color"
                />
            </Stack>
        </main>
    );
}

export default CodeConfirmation;