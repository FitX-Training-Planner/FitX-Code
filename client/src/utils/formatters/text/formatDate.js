export function formatDate(date) {
    const newDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const isToday = newDate.toDateString() === today.toDateString();
    const isYesterday = newDate.toDateString() === yesterday.toDateString();

    if (isToday) return "hoje";
    if (isYesterday) return "ontem";

    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const year = String(newDate.getFullYear());

    return `${day}/${month}/${year}`;
}

export function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    const formattedDate = formatDate(dateTime);

    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${formattedDate} às ${hour}:${minutes}`;
}
