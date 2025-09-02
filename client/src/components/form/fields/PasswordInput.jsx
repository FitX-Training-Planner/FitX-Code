import { useState } from "react";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { formattEmailAndPassword } from "../../../utils/formatters/user/formatOnChange";
import { isPasswordValid } from "../../../utils/validators/userValidator";
import { useTranslation } from "react-i18next";
import TextInput from "./TextInput";

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
            handleTogglePasswordVisibility={() => setIsVisible(prevIsVisible => !prevIsVisible)}
            isPasswordVisible={isVisible}
        />
    );
}

export default PasswordInput;