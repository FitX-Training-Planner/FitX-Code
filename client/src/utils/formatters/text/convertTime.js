export default function convertTime(amount, timeUnit = "second") {
    let totalSeconds;

    switch (timeUnit) {
        case "second":
            totalSeconds = amount;

            break;
        case "minute":
            totalSeconds = amount * 60;

            break;
        case "hour":
            totalSeconds = amount * 3600;

            break;
        default:
            return "error";
    }

    if (totalSeconds < 60) {
        const seconds = Math.floor(totalSeconds);

        return `${String(seconds)} segundos`;
    }

    if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} minutos`;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} horas`;
}
