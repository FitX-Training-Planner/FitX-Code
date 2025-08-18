import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import styles from "./AcceptTerms.module.css";

function AcceptTerms({ 
    isAccepted, 
    setIsAccepted, 
    description 
}) {
    const { t } = useTranslation();

    return (
        <Stack
            direction="row"
            className={styles.accept_terms}
            justifyContent="center"
        >
            <span
                className={isAccepted ? styles.accepted : undefined}
                onClick={() => setIsAccepted(prev => !prev)}
            ></span>

            <Stack
                className={styles.term_description}
                gap="0.1em"
                alignItems="start"
            >
                <p
                    onClick={() => setIsAccepted(prev => !prev)}
                >
                    {description} 
                </p>
                
                <p>
                    {`${t("checkThe")} `}

                    <a 
                        href="/terms-and-conditions" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.terms_link}
                    >
                        {t("UseTermsAndConditions")}
                    </a>

                    {` ${t("forMoreInfo")}`}.
                </p>
            </Stack>
        </Stack>
    );
};

export default AcceptTerms;
