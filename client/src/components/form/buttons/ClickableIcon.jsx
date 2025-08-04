import { useSelector } from "react-redux";
import styles from "./ClickableIcon.module.css";

function ClickableIcon({ 
    iconSrc,
    name, 
    handleClick, 
    size = "medium", 
    hasTheme = true, 
    isSubmit = false 
}) {
    const user = useSelector(state => state.user);

    return (
        <button
            type={isSubmit ? "submit" : "button"}
            className={`${styles.clickable_icon} ${styles[size]} ${user.config.isDarkTheme && hasTheme ? styles.dark_theme : undefined}`}
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