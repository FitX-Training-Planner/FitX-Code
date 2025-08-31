import { useState } from "react";
import Stack from "../../containers/Stack";
import styles from "./TextInput.module.css";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { formattEmailAndPassword } from "../../../utils/formatters/user/formatOnChange";
import { isPasswordValid } from "../../../utils/validators/userValidator";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TextInput from "./TextInput";
import ClickableIcon from "../buttons/ClickableIcon";

function PasswordInput({ 
    object, 
    setObject,
    setHasError,
    errors,
    setErrors,
    alertError,
    name = "password"
}) {
    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState(false)

    return (
        <Stack
            className={styles.password_input}
        >
            <TextInput
                type={isVisible ? "text": "password"}
                name={name}
                placeholder={t("passwordPlaceholder")}
                labelText={t("password")}
                value={object[name]}
                handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, isPasswordValid, object, setObject, setHasError, setErrors)}
                icon="/images/icons/password.png"
                alertMessage={alertError}
                error={errors[name]}
                maxLength={20}
            />

            <ClickableIcon
                iconSrc={`/images/icons/${isVisible ? "opened_eye" : "closed_eye"}.png`}
                name={t("toggleVisibility")}
                handleClick={() => setIsVisible(prevIsVisible => !prevIsVisible)}
                size="small"
            />
        </Stack>
    );
}

export default PasswordInput;