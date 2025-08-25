import { useTranslation } from "react-i18next";
import styles from "./TermsLink.module.css";

function TermsLink() {
    const { t } = useTranslation();

    return (
        <a 
            href="/app/terms-and-conditions" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.terms_link}
        >
            {t("UseTermsAndConditions")}
        </a>
    );
};

export default TermsLink;
