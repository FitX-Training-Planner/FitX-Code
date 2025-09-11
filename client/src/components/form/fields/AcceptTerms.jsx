import { useTranslation } from "react-i18next";
import Stack from "../../containers/Stack";
import styles from "./AcceptTerms.module.css";
import Link from "../../text/Link";

function AcceptTerms({ 
    isAccepted, 
    setIsAccepted, 
    description,
    policyNames,
    policyDestinies
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

                {policyDestinies?.length > 0 ? (
                    policyDestinies?.map((destiny, index) => (
                        <p
                            key={index}
                        >
                            {t("checkThe")}

                            <Link 
                                destiny={destiny}
                                text={policyNames[index]}
                            />

                            {t("forMoreInfo")}.
                        </p>
                    ))
                ) : (
                    <p>
                        {t("checkThe")}

                        <Link />

                        {t("forMoreInfo")}.
                    </p>
                )}
            </Stack>
        </Stack>
    );
};

export default AcceptTerms;
