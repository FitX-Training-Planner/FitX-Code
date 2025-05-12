import styles from "./Login.module.css";
import Stack from "./../containers/Stack";
import Title from "../text/Title";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../form/forms/LoginForm";
import SignUpForm from "../form/forms/SignUpForm";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { validateLoginRequestData, validateSignUpRequestData } from "../../utils/validators/FormValidator";
import ClickableIcon from "../form/buttons/ClickableIcon";

function Login() {
    const navigate = useNavigate();

    const loginRef = useRef(null);
    const signUpRef = useRef(null);

    const [user, setUser] = useState({
        name: "",
        email: "",
        contact: "",
        password: ""
    });
    const [isLogin, setIsLogin] = useState(true);
    const [signUpError, setSignUpError] = useState(false);
    const [loginError, setLoginError] = useState(false);

    function handleOnChangeFormType() {
        setUser({
            name: "",
            email: "",
            contact: "",
            password: ""
        });

        setIsLogin(prevIsLogin => !prevIsLogin);

        setLoginError(false);
    }

    function handleOnLoginSubmit(e) {
        e.preventDefault();

        if (!validateLoginRequestData(loginError, setLoginError, user.email, user.password)) return;
    }

    function handleOnSignUpSubmit(e) {
        e.preventDefault();

        if (!validateSignUpRequestData(signUpError, setSignUpError, user.name, user.email, user.contact, user.password)) return;
    }

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
                        >
                            <Stack
                                gap="3em"
                            >
                                {isLogin ? 
                                    <LoginForm
                                        user={user}
                                        setUser={setUser}
                                        loginError={loginError}
                                        setLoginError={setLoginError}
                                        navigate={navigate}
                                        handleChangeFormType={handleOnChangeFormType}
                                        handleSubmit={handleOnLoginSubmit}
                                    />
                                :
                                    <SignUpForm
                                        user={user}
                                        setUser={setUser}
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
                            handleClick={() => window.open("https://www.instagram.com/seu_perfil/", "_blank", "noopener,noreferrer")}
                        />

                        <ClickableIcon
                            iconSrc="images/icons/youtube.png"
                            name="Youtube"
                            handleClick={() => window.open("https://www.youtube.com/c/seu_canal", "_blank", "noopener,noreferrer")}
                            />

                        <ClickableIcon
                            iconSrc="images/icons/tiktok.png"
                            name="TikTok"
                            handleClick={() =>window.open("https://www.tiktok.com/@seu_perfil", "_blank", "noopener,noreferrer")}
                            />

                        <ClickableIcon
                            iconSrc="images/icons/github.png"
                            name="GitHub"
                            handleClick={() =>  window.open("https://github.com/FitX-Training-Planner", "_blank", "noopener,noreferrer")}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </main>
    );
}

export default Login;