import styles from "./Login.module.css";
import Stack from "./../containers/Stack";
import Title from "../text/Title";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../form/forms/LoginForm";
import SignUpForm from "../form/forms/SignUpForm";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { validateLoginRequestData, validateSignUpRequestData } from "../../utils/validators/formValidator";
import ClickableIcon from "../form/buttons/ClickableIcon";
import useRequest from "../../hooks/useRequest";
import { useConfirmIdentityCallback } from "../../app/ConfirmIdentityCallbackProvider";
import authUser from "../../utils/requests/auth";
import api from "../../api/axios";
import useWindowSize from "../../hooks/useWindowSize";

function Login() {
    const navigate = useNavigate();
    
    const { width } = useWindowSize();
    const { setHandleOnConfirmed } = useConfirmIdentityCallback();
    const { request: loginRequest } = useRequest();
    const { request: signUpRequest } = useRequest();

    const loginRef = useRef(null);
    const signUpRef = useRef(null);

    const defaultUser = useMemo(() => ({
        name: "",
        email: "",
        password: ""
    }), []);

    const [localUser, setLocalUser] = useState(defaultUser);
    const [isLogin, setIsLogin] = useState(true);
    const [signUpError, setSignUpError] = useState(false);
    const [loginError, setLoginError] = useState(false);

    useEffect(() => {
        document.title = "Login";
    }, []);

    const handleOnChangeFormType = useCallback(() => {
        setLocalUser(defaultUser);

        setIsLogin(prevIsLogin => !prevIsLogin);

        setLoginError(false);
    }, [defaultUser]);

    const handleOnLoginSubmit = useCallback((e) => {
        e.preventDefault();
    
        if (!validateLoginRequestData(loginError, setLoginError, localUser.email, localUser.password)) return;
    
        const loginFormData = new FormData();
    
        loginFormData.append("email", localUser.email);
        loginFormData.append("password", localUser.password);
    
        const postLogin = () => {
            return api.post("/login", loginFormData);
        }
        
        const handleOnLoginSuccess = (data) => {
            navigate("/code-confirmation", { state: { localUser: {...localUser, ID: data.ID}, origin: "login" } });

            setHandleOnConfirmed(() => (ID, dispatch, navigate, notify, authRequest, setUser) => 
                authUser(ID, dispatch, navigate, notify, authRequest, setUser, data.isClient)
            );
        };
        
        const handleOnLoginError = (err) => {
            if (err.response?.status === 401) {
                setLoginError(true);
            }
        };
    
        loginRequest(postLogin, handleOnLoginSuccess, handleOnLoginError, "Checando dados", "Dados validados!", "Falha ao logar!");
    }, [localUser, loginError, loginRequest, navigate, setHandleOnConfirmed]);

    const handleOnSignUpSubmit = useCallback((e) => {
        e.preventDefault();
    
        if (!validateSignUpRequestData(signUpError, setSignUpError, localUser.name, localUser.email, localUser.password)) return;
    
        const signUpFormData = new FormData();
    
        signUpFormData.append("email", localUser.email);
    
        const postSignUp = () => {
            return api.post("/sign-up", signUpFormData);
        }
    
        const handleOnSignUpSuccess = () => {
            navigate("/code-confirmation", { state: { localUser, origin: "signUp" } });
        };
    
        const handleOnSignUpError = () => {
            setSignUpError(true);
        };
    
        setHandleOnConfirmed(() => () => {
            navigate("/create-config", { state: { localUser } });
        });
    
        signUpRequest(postSignUp, handleOnSignUpSuccess, handleOnSignUpError, "Checando dados", "Dados validados!", "Falha ao checar dados!");
    }, [localUser, navigate, setHandleOnConfirmed, signUpError, signUpRequest]);

    return (
        <main>
            <Stack
                direction="row"
                gap="0"
                className={styles.login_page_container}
            >
                <SwitchTransition>
                    <CSSTransition
                        key={isLogin ? "login" : "signUp"}
                        timeout={1000}
                        classNames="fade"
                        nodeRef={isLogin ? loginRef : signUpRef}
                    >
                        <div 
                            ref={isLogin ? loginRef : signUpRef}
                            className={styles.login_form_container}
                            style={{ width: width <= 640 && "100%" }}
                        >
                            <Stack
                                gap="3em"
                            >
                                {isLogin ? 
                                    <LoginForm
                                        user={localUser}
                                        setUser={setLocalUser}
                                        loginError={loginError}
                                        setLoginError={setLoginError}
                                        navigate={navigate}
                                        handleChangeFormType={handleOnChangeFormType}
                                        handleSubmit={handleOnLoginSubmit}
                                    />
                                :
                                    <SignUpForm
                                        user={localUser}
                                        setUser={setLocalUser}
                                        setSignUpError={setSignUpError}
                                        navigate={navigate}
                                        handleChangeFormType={handleOnChangeFormType}
                                        handleSubmit={handleOnSignUpSubmit}
                                    />
                                }
                            </Stack>    
                        </div>
                    </CSSTransition>
                </SwitchTransition>

                {width > 640 &&
                    <Stack
                        className={styles.welcome_container}
                    >
                        <Stack
                            alignItems="start"
                            className={styles.welcome_title}
                        >
                            <Title
                                headingNumber={2}
                                text="Bem-Vindo ao FitX"
                                varColor="--dark-color"
                                textAlign="start"
                            />


                            <p>
                                A melhor plataforma para você, que é um praticante ou treinador de musculação, 
                                gerir seus treinos.
                            </p>
                        </Stack>

                        <img
                            src="images\backgrounds\login_welcome_illustration.png"
                            alt="FitX Illustration"
                        />    

                        <Stack
                            direction="row"
                            alignItems="end"
                            className={styles.social_medias}
                        >
                            <ClickableIcon
                                iconSrc="images/icons/instagram.png"
                                name="Instagram"
                                // handleClick={() => window.open("https://www.instagram.com/seu_perfil/", "_blank", "noopener,noreferrer")}
                                hasTheme={false}
                           />

                            <ClickableIcon
                                iconSrc="images/icons/youtube.png"
                                name="Youtube"
                                // handleClick={() => window.open("https://www.youtube.com/c/seu_canal", "_blank", "noopener,noreferrer")}
                                hasTheme={false}
                           />

                            <ClickableIcon
                                iconSrc="images/icons/tiktok.png"
                                name="TikTok"
                                // handleClick={() => window.open("https://www.tiktok.com/@seu_perfil", "_blank", "noopener,noreferrer")}
                                hasTheme={false}
                           />

                            <ClickableIcon
                                iconSrc="images/icons/github.png"
                                name="GitHub"
                                // handleClick={() =>  window.open("https://github.com/FitX-Training-Planner", "_blank", "noopener,noreferrer")}
                                hasTheme={false}
                           />
                        </Stack>
                    </Stack>
                }
            </Stack>
        </main>
    );
}

export default Login;