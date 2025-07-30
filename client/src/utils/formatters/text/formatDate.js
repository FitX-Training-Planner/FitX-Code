export function formatDate(date, t) {
    const newDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const isToday = newDate.toDateString() === today.toDateString();
    const isYesterday = newDate.toDateString() === yesterday.toDateString();

    if (isToday) return t("today");
    if (isYesterday) return t("yesterday");

    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const year = String(newDate.getFullYear());

    return `${day}/${month}/${year}`;
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
