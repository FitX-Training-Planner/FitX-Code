import { isEmailValid, isNameValid, isPasswordValid } from "./userValidator";

export function hasEmptyFieldsInObject(object) {
    return Object.values(object).some(value => value === null || value === "")
}

export function validateLoginRequestData(loginError, setLoginError, email, password) {
    if (loginError) return false;

    if (hasEmptyFieldsInObject({email, password})) {
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

    if (hasEmptyFieldsInObject({name, email, password})) {
        setSignUpError(true);

        return false;
    }

    if (!(isNameValid(name) && isEmailValid(email) && isPasswordValid(password))) {
        setSignUpError(true);

        return false;
    }

    return true;
}
