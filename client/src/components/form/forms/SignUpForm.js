import styles from "./LoginForm.module.css";
import { useState } from "react";
import { formattEmailAndPassword, formattName } from "../../../utils/formatters/user/formatOnChange";
import { isEmailValid, isNameValid, isPasswordValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import TextInput from "../fields/TextInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import NonBackgroundButton from "../buttons/NonBackgroundButton";
import Title from "../../text/Title";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";

function SignUpForm({ user, setUser, setSignUpError, handleChangeFormType, handleSubmit }) {
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        emptyFields: true
    });

    const { t } = useTranslation();
    
    return (
        <>
            <Stack
                gap="0"
                className={styles.title_container}
            >
                <img 
                    src="/logo180.png" 
                    alt=""
                />

                <Title
                    headingNumber={1}
                    text={t("signUp")}
                />
            </Stack>
            
            <form 
                onSubmit={handleSubmit}
            >
                <Stack
                    gap="3em"
                    alignItems="start"
                >
                    <p>
                        - {t("fillAllFields")}
                    </p>

                    <Stack
                        gap="0.5em"
                    >
                        <TextInput
                            name="name"
                            placeholder={t("namePlaceholder")}
                            labelText={t("name")}
                            value={user.name}
                            handleChange={(e) => handleOnChangeTextField(e, formattName, isNameValid, user, setUser, setSignUpError, setErrors)}
                            icon="/images/icons/user2.png"
                            alertMessage={t("alertName")}
                            error={errors.name}
                            maxLength={100}
                        />

                        <TextInput
                            type="email"
                            name="email"
                            placeholder={t("emailPlaceholder")}
                            labelText={t("email")}
                            value={user.email}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, isEmailValid, user, setUser, setSignUpError, setErrors)}
                            icon="/images/icons/email.png"
                            alertMessage={t("alertEmail")}
                            error={errors.email}
                            maxLength={254}
                        />

                        <TextInput
                            type="password"
                            name="password"
                            placeholder={t("passwordPlaceholder")}
                            labelText={t("password")}
                            value={user.password}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, isPasswordValid, user, setUser, setSignUpError, setErrors)}
                            icon="/images/icons/password.png"
                            alertMessage={t("alertPassword")}
                            error={errors.password}
                            maxLength={20}
                        />
                    </Stack>

                    <Stack>
                        <SubmitFormButton
                            text={t("signUp")}
                        />

                        <span>
                            {t("or")}
                        </span>

                        <NonBackgroundButton
                            text={t("login")}
                            handleClick={handleChangeFormType}
                            varColor="--theme-color"
                        />
                    </Stack>
                </Stack>
            </form>
        </>
    );
}

export default SignUpForm;