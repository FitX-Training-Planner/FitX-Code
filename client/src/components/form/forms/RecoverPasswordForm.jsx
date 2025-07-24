import { formattEmailAndPassword } from "../../../utils/formatters/user/formatOnChange";
import Stack from "../../containers/Stack";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextInput from "../fields/TextInput";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";
import { isEmailValid, isPasswordValid } from "../../../utils/validators/userValidator";
import { useState } from "react";
import styles from "./CodeConfirmationForm.module.css";

function RecoverPasswordForm({
    account,
    setAccount,
    setRecoverPasswordError,
    handleSubmit 
}) {
    const { t } = useTranslation();
    
    const [errors, setErrors] = useState({
        email: false,
        newPassword: false
    });

    return (
        <form 
            onSubmit={handleSubmit}
        >
            <Stack
                gap="2em"
            >
                <Stack
                    gap="2em"
                >
                    <p
                        className={styles.user_info}
                    >
                        {t("recoverPasswordPlaceholder")}
                    </p>

                    <Stack
                        gap="0.5em"
                    >
                        <TextInput
                            type="email"
                            name="email"
                            placeholder={t("emailPlaceholder")}
                            labelText={t("email")}
                            value={account.email}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, isEmailValid, account, setAccount, setRecoverPasswordError, setErrors)}
                            icon="/images/icons/email.png"
                            alertMessage={t("alertEmail")}
                            error={errors.email}
                            maxLength={254}
                        />

                        <TextInput
                            type="password"
                            name="newPassword"
                            placeholder={t("newPasswordPlaceholder")}
                            labelText={t("newPassword")}
                            value={account.newPassword}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, isPasswordValid, account, setAccount, setRecoverPasswordError, setErrors)}
                            icon="/images/icons/password.png"
                            alertMessage={t("alertPassword")}
                            error={errors.newPassword}
                            maxLength={20}
                        />
                    </Stack>
                </Stack>

                <SubmitFormButton
                    text={t("update")}
                />
            </Stack>
        </form>
    );
}

export default RecoverPasswordForm;