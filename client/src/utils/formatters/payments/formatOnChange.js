export function formatPrice(price) {
    let formattedPrice = price.replace(/[^\d,]/g, "");

    const parts = formattedPrice.split(",");

    let integer = parts[0] || "";
    let decimal = parts[1] || "";

    integer = integer.replace(/^0+/, "");

    if (decimal.length > 2) decimal = decimal.slice(0, 2);

    if (integer.length > 5) integer = integer.slice(0, 5);

    return `${integer},${decimal}`;
}


export function formatPriceToBR(price) {
    price = price.replace(",", ".");

    const number = parseFloat(price);

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}