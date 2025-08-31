import styles from "./LoginForm.module.css";
import { formattEmailAndPassword } from "../../../utils/formatters/user/formatOnChange";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import NonBackgroundButton from "../buttons/NonBackgroundButton";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextInput from "../fields/TextInput";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";
import { useTranslation } from "react-i18next";
import PasswordInput from "../fields/PasswordInput";

function LoginForm({
    user,
    setUser,
    loginError,
    setLoginError,
    navigate,
    handleChangeFormType,
    handleSubmit 
}) {
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
                    text={t("login")}
                />
            </Stack>

            <form 
                onSubmit={handleSubmit}
            >
                <Stack
                    gap="3em"
                >
                    <Stack
                        gap="0.5em"
                    >
                        <TextInput
                            type="email"
                            name="email"
                            placeholder={t("emailPlaceholder")}
                            labelText={t("email")}
                            value={user.email}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, undefined, user, setUser, setLoginError)}
                            icon="/images/icons/email.png"
                            maxLength={254}
                        />

                        <PasswordInput
                            object={user}
                            setObject={setUser}
                            setHasError={setLoginError}
                            errors={{ password: loginError }}
                            alertError={t("alertLogin")}
                        />
                    </Stack>

                    <NonBackgroundButton
                        text={t("forgotPassword")}
                        handleClick={() => navigate("/recover-password")}
                        varColor="--alert-color"
                    />

                    <Stack>
                        <SubmitFormButton
                            text={t("login")}
                        />

                        <span>
                            {t("or")}
                        </span>

                        <NonBackgroundButton
                            text={t("signUp")}
                            handleClick={handleChangeFormType}
                            varColor="--theme-color"
                        />
                    </Stack>
                </Stack>
            </form>
        </>
    );
}

export default LoginForm;