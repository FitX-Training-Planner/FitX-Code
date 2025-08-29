import { utcToZonedTime, format } from "date-fns-tz";

export function formatDate(date, t) {
    const timeZone = "America/Sao_Paulo";

    const today = utcToZonedTime(new Date(), timeZone);
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    const isYesterday = format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd");

    if (isToday) return t("today");
    if (isYesterday) return t("yesterday");

    return format(date, "dd/MM/yyyy", { timeZone });
}

export function formatDateToExtend(date, locale) {
    const newDate = new Date(date);

    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(newDate);
}

export function formatDateTime(dateTime, t) {
    const date = new Date(dateTime);

    const formattedDate = formatDate(dateTime, t);

    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${formattedDate} ${t("atHours")} ${hour}:${minutes}`;
}
