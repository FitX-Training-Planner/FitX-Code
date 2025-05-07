import styles from "./Login.module.css";
import Stack from "./../containers/Stack";
import Title from "../text/Title";
import TextInput from "../form/fields/TextInput";
import { useState } from "react";
import { removeSpaces } from "../../utils/formatters/RemoveSpaces";
import SubmitButton from "../form/buttons/SubmitFormButton";
import { Link } from 'react-router-dom';
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";

function Login() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        contact: "",
        password: ""
    });
    const [isLogin, setIsLogin] = useState(true);
    const [loginError, setLoginError] = useState(false);

    const LoginForm = () => (
        <>
            <TextInput
                name="email"
                placeholder="Insira seu e-mail"
                labelText="E-mail"
                value={user.email}
                handleChange={handleOnChangeEmailAndPassword}
                // icon={}
                maxLength={255}
            />

            <TextInput
                name="password"
                placeholder="Insira sua senha"
                labelText="Senha"
                value={user.password}
                handleChange={handleOnChangeEmailAndPassword}
                // icon={}
                alertMessage="E-mail e/ou senha inválidos."
                error={loginError}
                maxLength={20}
            />

            {/* <Link 
                to="/recoverPassword"
            >
                Esqueci minha senha
            </Link> */}
        </>
    )

    const SignUpForm = () => (
        <>
            <TextInput
                name="name"
                placeholder="Insira seu nome"
                labelText="Nome"
                value={user.name}
                handleChange={handleOnChangeEmailAndPassword}
                // icon={}
                alertMessage="O nome deve ter entre 3 e 100 caracteres, sem símbolos ou números."
                error={false}
                maxLength={100}
            />

            <Stack
                direction="row"
            >
                <TextInput
                    name="email"
                    placeholder="Insira seu e-mail"
                    labelText="E-mail"
                    value={user.email}
                    handleChange={handleOnChangeEmailAndPassword}
                    // icon={}
                    alertMessage={"E-mail inválido."}
                    error={false}
                    maxLength={255}
                />

                <TextInput
                    name="contact"
                    placeholder="Insira seu número de contato"
                    labelText="Contato"
                    value={user.contact}
                    handleChange={handleOnChangeEmailAndPassword}
                    // icon={}
                    alertMessage={"Número de contato inválido."}
                    error={false}
                    maxLength={15}
                />
            </Stack>

            <TextInput
                name="password"
                placeholder="Insira sua senha"
                labelText="Senha"
                value={user.password}
                handleChange={handleOnChangeEmailAndPassword}
                // icon={}
                alertMessage="A senha deve ter entre 10 e 20 caracteres, com no mínimo um símbolo, número e letra."
                error={false}
            />
        </>
    )

    function handleOnChangeEmailAndPassword(e) {
        setUser(prevUser => ({...prevUser, [e.target.name]: removeSpaces(e.target.value)}));
    }

    return (
        <main
            className={styles.login_page}
        >
            <Stack
                direction="row"
                gap="0"
            >
                <Stack
                    gap="3em"
                    className={styles.login_form_container}
                >
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
                            text={isLogin ? "Login" : "Criar Conta"}
                        />
                    </Stack>

                    <Stack
                        gap="3em"
                    >
                        <Stack
                            gap="0.5em"
                        >
                            {isLogin ? <LoginForm/> : <SignUpForm/>}
                        </Stack>


                        <Stack>
                            <SubmitButton
                                text={isLogin ? "Entrar" : "Criar Conta"}
                            />

                            <span>
                                Ou
                            </span>

                            <NonBackgroundButton
                                text={isLogin ? "Criar uma conta" : "Entrar em conta já existente"}
                                handleClick={() => setIsLogin(!isLogin)}
                                varColor="--theme-color"
                            />
                        </Stack>
                    </Stack>
                </Stack>

                <div 
                    className={styles.welcome_container}
                >
                    
                </div>
            </Stack>
        </main>
    );
}

export default Login;