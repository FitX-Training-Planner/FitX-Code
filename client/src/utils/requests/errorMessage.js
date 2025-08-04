export function getErrorMessageCodeError(err) {
    return err.response?.data?.message ? `systemMessages.${err.response?.data?.message}` : err.message;
}
