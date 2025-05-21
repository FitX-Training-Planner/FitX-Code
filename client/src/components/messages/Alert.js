import styles from "./Alert.module.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

function Alert({ varColor = "--dark-color", alertMessage }) {
    return (
        <Tippy
            content={alertMessage}
            placement="top"
            animation="scale"
            arrow
            theme="custom"
            disabled={!alertMessage}
        >
            <span 
                className={styles.alert_sign}
                style={{ "--var-color": `var(${varColor})` }}
            >
                !
            </span>
        </Tippy>
    );
}

export default Alert;
