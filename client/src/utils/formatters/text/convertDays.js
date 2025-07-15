export default function convertDays(amount, dayUnit = "day") {
    let totalDays;

    switch (dayUnit) {
        case "day":
            totalDays = amount;

            break;
        case "week":
            totalDays = amount * 7;

            break;
        case "month":
            totalDays = amount * 30;

            break;
        case "year":
            totalDays = amount * 365;

            break;
        default:
            return "error";
    }

    const years = Math.floor(totalDays / 365);
    let remainingDays = totalDays % 365;

    const months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;

    const weeks = Math.floor(remainingDays / 7);

    const days = remainingDays % 7;

    const parts = [];

    if (years) parts.push(`${years} ano${years > 1 ? "s" : ""}`);

    if (months) parts.push(`${months} mês${months > 1 ? "es" : ""}`);
 
    if (weeks) parts.push(`${weeks} semana${weeks > 1 ? "s" : ""}`);
 
    if (days) parts.push(`${days} dia${days > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "0 dias";
}
