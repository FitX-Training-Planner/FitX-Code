import styles from "./NonBackgroundButton.module.css";

function NonBackgroundButton({ 
    text, 
    handleClick, 
    varColor = "--dark-color", 
    className 
}) {
    return (
        <button
            type="button"
            onClick={handleClick}
            style={{ color: `var(${varColor})`, "--var-color": `var(${varColor})` }}
            className={`${styles.non_background_color} ${className || undefined}`}
        >
            {text}
        </button>
    );
}

export default NonBackgroundButton;