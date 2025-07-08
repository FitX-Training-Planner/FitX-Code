export default function convertTime(time, timeUnit = "second") {
    let totalSeconds;

    if (timeUnit === "second") {
        totalSeconds = time;
    } else if (timeUnit === "minute") {
        totalSeconds = time * 60;
    } else if (timeUnit === "hour") {
        totalSeconds = time * 3600;
    } else {
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
