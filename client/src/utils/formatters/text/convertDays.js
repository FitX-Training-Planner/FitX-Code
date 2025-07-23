export default function convertDays(amount, dayUnit = "day", t) {
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

    if (years) parts.push(`${years} ${t("year")}${years > 1 ? "s" : ""}`);

    if (months) parts.push(`${months} ${months > 1 ? t("months") : t("month")}`);
 
    if (weeks) parts.push(`${weeks} ${t("week")}${weeks > 1 ? "s" : ""}`);
 
    if (days) parts.push(`${days} ${t("day")}${days > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : `0 ${t("days")}`;
}
