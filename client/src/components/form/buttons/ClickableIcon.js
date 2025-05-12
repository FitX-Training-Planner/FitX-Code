import styles from "./ClickableIcon.module.css";

function ClickableIcon({ iconSrc, name, handleClick }) {
    return (
        <button
            type="button"
            className={styles.clickable_icon}
            title={name}
            onClick={handleClick}
        >
            <img
                src={iconSrc}
                alt={`${name} Icon`}
            />
        </button>
    );
}

export default ClickableIcon;