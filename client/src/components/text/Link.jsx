import { useTranslation } from "react-i18next";
import styles from "./Link.module.css";

function Link({
    destiny = "/app/terms-and-conditions",
    text
}) {
    const { t } = useTranslation();

    return (
        <>
            {" "}
            <a 
                href={destiny} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link}
            >
                {text || t("UseTermsAndConditions")}
            </a>
            {" "}
        </>
    );
};

export default Link;
