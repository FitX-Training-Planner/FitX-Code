import { utcToZonedTime, format } from "date-fns-tz";

const timeZone = "America/Sao_Paulo";

export function formatDate(date, t) {
    const today = getToday();
    const yesterday = utcToZonedTime(today);

    yesterday.setDate(today.getDate() - 1);

    const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    const isYesterday = format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd");

    if (isToday) return t("today");
    if (isYesterday) return t("yesterday");

    return format(date, "dd/MM/yyyy", { timeZone });
}

export function formatDateToExtend(date, locale) {
    const parsedDate = typeof date === "string" ? utcToZonedTime(new Date(date)) : date;

    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(parsedDate);
}

export function formatDateTime(dateTime, t) {
    const date = utcToZonedTime(new Date(dateTime));

    const formattedDate = formatDate(dateTime, t);

    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${formattedDate} ${t("atHours")} ${hour}:${minutes}`;
}

export function getToday() {
    return utcToZonedTime(new Date(), timeZone);
} 

export function getDaysLeft(endDate) {
  const today = getToday()
  const end = utcToZonedTime(new Date(endDate));

  const diffTime = end - today; 
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}