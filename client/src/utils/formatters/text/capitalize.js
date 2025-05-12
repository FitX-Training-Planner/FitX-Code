export default function capitalize(name) {
    const words = name
        .toLowerCase()
        .split(" ");

    const capitalizedName = words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    )

    return capitalizedName.join(" ");
}