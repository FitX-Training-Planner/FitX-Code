export function getErrorMessageFromError(err) {
    return err.response?.data?.message || "Erro não identificado.";
}
