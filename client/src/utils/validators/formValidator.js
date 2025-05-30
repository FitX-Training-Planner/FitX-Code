import { isCREFValid, isEmailValid, isNameValid, isPasswordValid, isTrainerDescriptionValid } from "./userValidator";

export function hasEmptyFieldsInObject(object) {
    return Object.values(object).some(value => value === null || value === "")
}

export function validateLoginRequestData(loginError, setLoginError, email, password) {
    if (loginError) return false;

    if (hasEmptyFieldsInObject({ email, password })) {
        setLoginError(true);

        return false;
    }

    if (!(isEmailValid(email) && isPasswordValid(password))) {
        setLoginError(true);

        return false;
    }

    return true;
}

export function validateSignUpRequestData(signUpError, setSignUpError, name, email, password) {
    if (signUpError) return false;

    if (hasEmptyFieldsInObject({ name, email, password })) {
        setSignUpError(true);

        return false;
    }

    if (!(isNameValid(name) && isEmailValid(email) && isPasswordValid(password))) {
        setSignUpError(true);

        return false;
    }

    return true;
}

export function validateTrainerPostRequestData(trainerError, setTrainerError, crefNumber, description, crefUF) {
    if (trainerError) return false;

    if (hasEmptyFieldsInObject({ crefNumber, crefUF })) {
        setTrainerError(true);

        return false;
    }

    if (!(isCREFValid(crefNumber) && crefUF && isTrainerDescriptionValid(description))) {
        setTrainerError(true);
        console.log("valido")

        return false;
    }

    return true;
}

export function validateCodeRequestData(codeError, setCodeError, code) {
    if (codeError) return false;

    for (let i = 0; i < code.length; i++) {
        if (hasEmptyFieldsInObject(code[i])) {
            setCodeError(true);

            return false;
        }
    }
        
    return true;
}