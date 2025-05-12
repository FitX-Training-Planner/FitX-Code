import styles from "./AlertSign.module.css";

function AlertSign({ varSize = "--text-size", varColor = "--dark-color" }) {
    return (
        <span
            className={styles.alert_sign}
            style={{ "--var-color": `var(${varColor})`, "--var-size": `var(${varSize})` }}
            title="Alerta"
        />
    );
}

export default AlertSign;