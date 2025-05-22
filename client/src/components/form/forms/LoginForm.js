import styles from "./LoginForm.module.css";
import { formattEmailAndPassword } from "../../../utils/formatters/user/formattOnChange";
import Stack from "../../containers/Stack";
import Title from "../../text/Title";
import NonBackgroundButton from "../buttons/NonBackgroundButton";
import SubmitFormButton from "../buttons/SubmitFormButton";
import TextInput from "../fields/TextInput";
import { useCallback } from "react";

function LoginForm({ user, setUser, loginError, setLoginError, navigate, handleChangeFormType, handleSubmit }) {
    const handleOnChangeUserData = useCallback((e) => {
        const value = formattEmailAndPassword(e.target.value);
        
        setLoginError(false);
        
        setUser(prevUser => ({
            ...prevUser, 
            [e.target.name]: value
        }));
    }, [setLoginError, setUser]);
    
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

            <form onSubmit={handleSubmit}>
                <Stack
                    gap="3em"
                >
                    <Stack
                        gap="0.5em"
                    >
                        <TextInput
                            name="email"
                            placeholder="Insira seu e-mail"
                            labelText="E-mail"
                            value={user.email}
                            handleChange={(e) => handleOnChangeUserData(e)}
                            // icon={}
                            maxLength={254}
                        />

                        <TextInput
                            name="password"
                            placeholder="Insira sua senha"
                            labelText="Senha"
                            value={user.password}
                            handleChange={(e) => handleOnChangeUserData(e)}
                            // icon={}
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