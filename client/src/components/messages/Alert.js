import styles from "./Alert.module.css";

function Alert({ varSize = "--text-size", varColor = "--dark-color", alertMessage }) {
    return (
        <span
            className={styles.alert_sign}
            style={{ "--var-color": `var(${varColor})`, "--var-size": `var(${varSize})` }}
        >
            {alertMessage && 
                <div 
                    className={styles.tooltip}
                >
                    {alertMessage}
                </div>
            }
        </span>
    );
}

export default Alert;