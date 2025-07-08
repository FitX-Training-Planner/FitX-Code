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
    return photoFile.size <= 1 * 1024 * 1024;
}

export function isDocumentValid(documentFile) {
    return documentFile.size <= 5 * 1024 * 1024;
}

export function isCREFValid(cref) {
    const CREFRegex = /^[0-9]{6}-(P|G)$/;

    return CREFRegex.test(cref);
}

export function isTrainerDescriptionValid(description) {
    const lineBreakCount = (description.match(/\n/g) || []).length;

    return description.length <= 1200 && lineBreakCount < 15;
}

export function isMessageValid(message, isChatBot) {
    return message.length <= (isChatBot ? 100 : 1000);
}