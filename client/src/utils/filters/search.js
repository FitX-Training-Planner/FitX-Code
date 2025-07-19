export function textFilter(text, list) {
    return list.filter(option => String(option).toLowerCase().includes(String(text).toLowerCase()));
}
