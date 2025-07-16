import styles from "./ClickableIcon.module.css";
import { useEffect, useState } from "react";

function ClickableIcon({ iconSrc, name, handleClick, size = "medium", hasTheme = true, isSubmit = false }) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        setIsDarkTheme(document.documentElement.getAttribute("data-theme") === "dark");
    }, []);

    return (
        <button
            type={isSubmit ? "submit" : "button"}
            className={`${styles.clickable_icon} ${styles[size]} ${isDarkTheme && hasTheme ? styles.dark_theme : undefined}`}
            title={name || undefined}
            onClick={handleClick || undefined}
        >
            <img
                src={iconSrc}
                alt={name}
            />
        </button>
    );
}

export default ClickableIcon;