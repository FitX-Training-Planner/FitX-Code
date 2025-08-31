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
import AcceptTerms from "../fields/AcceptTerms";
import PasswordInput from "../fields/PasswordInput";

function SignUpForm({
    user,
    setUser,
    setSignUpError,
    handleChangeFormType,
    handleSubmit,
    acceptTerms,
    setAcceptedTerms
}) {
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

                        <PasswordInput
                            object={user}
                            setObject={setUser}
                            setHasError={setSignUpError}
                            setErrors={setErrors}
                            errors={errors}
                            alertError={t("alertPassword")}  
                        />
                    
                        <AcceptTerms
                            isAccepted={acceptTerms}
                            setIsAccepted={setAcceptedTerms}
                            description={t("createAccountTerms")}
                        />
                    </Stack>

                    <Stack>
                        <SubmitFormButton
                            text={t("checkData")}
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