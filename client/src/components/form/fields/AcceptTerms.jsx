import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import styles from "./AcceptTerms.module.css";
import TermsLink from "../../text/TermsLink";

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

                    <TermsLink />

                    {` ${t("forMoreInfo")}`}.
                </p>
            </Stack>
        </Stack>
    );
};

export default AcceptTerms;
