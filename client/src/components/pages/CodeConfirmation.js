import styles from "./CodeConfirmation.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import CodeConfirmationForm from "../form/forms/CodeConfirmationForm";
import Title from "../text/Title";
import Stack from "../containers/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import { useSystemMessage } from "../../app/SystemMessageProvider";
import useRequest from "../../hooks/useRequest";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import { useConfirmIdentityCallback } from "../../app/ConfirmIdentityCallbackProvider";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/user/userSlice";
import { getErrorMessageFromError } from "../../utils/requests/errorMessage";
import api from "../../api/axios";
import { validateCodeRequestData } from "../../utils/validators/formValidator";

function CodeConfirmation() {
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
        name: "",
        email: "",
        password: ""
    });    
    const [origin, setOrigin] = useState("login");
    const [error, setError] = useState(false);

    const generateCode = useCallback(email => {
        const generateCodeFormData = new FormData();

        generateCodeFormData.append("email", email);

        const postGenerateCode = () => {
            api.post("/identity-confirmation", generateCodeFormData);
        }    

        const handleOnGenerateCodeSuccess = () => {
            notify("Código enviado.");
        }    

        const handleOnGenerateCodeError = (err) => {
            notify(getErrorMessageFromError(err), "error");
        }    

        generateCodeRequest(postGenerateCode, handleOnGenerateCodeSuccess, handleOnGenerateCodeError, "Enviando código", "Código enviado!", "Falha ao enviar código!");
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

        generateCode(locationUser.email);
    }, [generateCode, location.state, navigate, notify]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        if (!validateCodeRequestData(error, setError, code)) return;

        const confirmCodeFormData = new FormData();

        confirmCodeFormData.append("email", localUser.email);

        const formattedCode = code.map(unit => unit.value).join("");

        confirmCodeFormData.append("code", formattedCode);

        const postConfirmCode = () => {
            api.post("/identity-confirmation", confirmCodeFormData);
        }

        const handleOnConfirmCodeSuccess = () => {
            origin === "login" 
            ? handleOnConfirmed(localUser.ID, dispatch, navigate, notify, authRequest, setUser)
            : handleOnConfirmed();
        }

        const handleOnConfirmCodeError = (err) => {
            notify(getErrorMessageFromError(err), "error");
        }

        confirmIdentityRequest(postConfirmCode, handleOnConfirmCodeSuccess, handleOnConfirmCodeError, "Enviando código", "Identidade confirmada!", "Falha ao confirmar identidade!");
    }, [error, code, localUser.email, localUser.ID, confirmIdentityRequest, origin, handleOnConfirmed, dispatch, navigate, notify, authRequest]);

    return (
        <main
            className={styles.code_confirmation_page}
        >
            <Stack
                className={styles.code_confirmation_container}
                gap="2em"
            >
                <Title
                    headingNumber={1}
                    text="Confirmação de Identidade"
                />

                <CodeConfirmationForm
                    code={code}
                    setCode={setCode}
                    handleSubmit={handleOnSubmit}
                    email={localUser.email}
                    setError={setError}
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