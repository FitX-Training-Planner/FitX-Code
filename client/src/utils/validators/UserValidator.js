export function isNameValid(name) {
    return name.length >= 3 && name.length <= 100;
}

export function isEmailValid(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email) && email.length <= 254;
}

export function isPasswordValid(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[-@$!%*?&+#_])[A-Za-z\d-@$!%*?&+#_]{10,}$/;

    return passwordRegex.test(password) && password.length <= 20;
}

export function isPhotoValid(photoFile) {
    // 2mb
    return photoFile.size <= 2 * 1024 * 1024;
}