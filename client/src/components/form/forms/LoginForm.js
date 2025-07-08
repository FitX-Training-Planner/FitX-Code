import styles from "./LoginForm.module.css";
import { formattEmailAndPassword } from "../../../utils/formatters/user/formatOnChange";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import NonBackgroundButton from "../buttons/NonBackgroundButton";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextInput from "../fields/TextInput";
import { handleOnChangeTextField } from "../../../utils/handlers/changeHandlers";

function LoginForm({ user, setUser, loginError, setLoginError, navigate, handleChangeFormType, handleSubmit }) {
    return (
        <>
            <Stack
                gap="0"
                className={styles.title_container}
            >
                <img 
                    src="logo180.png" 
                    alt="FitX Icon"
                />

                <Title
                    headingNumber={1}
                    text="Login"
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
                            placeholder="Insira seu e-mail"
                            labelText="E-mail"
                            value={user.email}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, undefined, user, setUser, setLoginError)}
                            icon="images/icons/email.png"
                            maxLength={254}
                        />

                        <TextInput
                            type="password"
                            name="password"
                            placeholder="Insira sua senha"
                            labelText="Senha"
                            value={user.password}
                            handleChange={(e) => handleOnChangeTextField(e, formattEmailAndPassword, undefined, user, setUser, setLoginError)}
                            icon="images/icons/password.png"
                            alertMessage="E-mail e/ou senha inválidos."
                            error={loginError}
                            maxLength={20}
                        />
                    </Stack>

                    <NonBackgroundButton
                        text="Esqueci minha senha"
                        handleClick={() => navigate("/recover-password")}
                        varColor="--alert-color"
                    />

                    <Stack>
                        <SubmitFormButton
                            text="Entrar"
                        />

                        <span>
                            Ou
                        </span>

                        <NonBackgroundButton
                            text="Criar uma conta"
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