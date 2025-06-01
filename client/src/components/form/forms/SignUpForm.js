import styles from "./LoginForm.module.css";
import { useCallback, useState } from "react";
import { formattEmailAndPassword, formattName } from "../../../utils/formatters/user/formatOnChange";
import { isEmailValid, isNameValid, isPasswordValid } from "../../../utils/validators/userValidator";
import Stack from "../../containers/Stack";
import TextInput from "../fields/TextInput";
import SubmitFormButton from "../buttons/SubmitFormButton";
import NonBackgroundButton from "../buttons/NonBackgroundButton";
import Title from "../../text/Title";
import { hasEmptyFieldsInObject } from "../../../utils/validators/formValidator";

function SignUpForm({ user, setUser, setSignUpError, handleChangeFormType, handleSubmit }) {
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        emptyFields: true
    });
    
    const handleOnChangeUserData = useCallback((e, formattFunction, dataValidator) => {
        setSignUpError(false);
        
        const name = e.target.name;
        const value = formattFunction(e.target.value);
        
        const newUser = {
            ...user, 
            [name]: value
        };

        setUser(newUser);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value !== "" && !dataValidator(value),
            emptyFields: hasEmptyFieldsInObject(newUser)
        }));
    }, [setSignUpError, setUser, user]);
    
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
                    text="Criar Conta"
                />
            </Stack>
            
            <form onSubmit={handleSubmit}>
                <Stack
                    gap="3em"
                    alignItems="start"
                >
                    <p 
                        className={errors.emptyFields ? styles.empty_fields_alert : undefined}
                    >
                        - Preenha todos os campos
                    </p>

                    <Stack
                        gap="0.5em"
                    >
                        <TextInput
                            name="name"
                            placeholder="Insira seu nome"
                            labelText="Nome"
                            value={user.name}
                            handleChange={(e) => handleOnChangeUserData(e, formattName, isNameValid)}
                            icon="images/icons/user2.png"
                            alertMessage="O nome deve ter entre 3 e 100 caracteres, sem símbolos ou números."
                            error={errors.name}
                            maxLength={100}
                        />

                        <TextInput
                            type="email"
                            name="email"
                            placeholder="Insira seu e-mail"
                            labelText="E-mail"
                            value={user.email}
                            handleChange={(e) => handleOnChangeUserData(e, formattEmailAndPassword, isEmailValid)}
                            icon="images/icons/email.png"
                            alertMessage="E-mail inválido."
                            error={errors.email}
                            maxLength={254}
                        />

                        <TextInput
                            type="password"
                            name="password"
                            placeholder="Insira sua senha"
                            labelText="Senha"
                            value={user.password}
                            handleChange={(e) => handleOnChangeUserData(e, formattEmailAndPassword, isPasswordValid)}
                            icon="images/icons/password.png"
                            alertMessage="A senha deve ter entre 10 e 20 caracteres, com no mínimo um símbolo, número e letra."
                            error={errors.password}
                            maxLength={20}
                        />
                    </Stack>

                    <Stack>
                        <SubmitFormButton
                            text="Criar Conta"
                        />

                        <span>
                            Ou
                        </span>

                        <NonBackgroundButton
                            text="Entrar em uma Conta já Existente"
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