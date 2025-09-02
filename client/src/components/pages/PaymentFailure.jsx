import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import NonBackgroundButton from "../form/buttons/NonBackgroundButton";
import Title from "../text/Title";

function PaymentFailure({ 
    hasFailed =  false
}) {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const failureReasons = useMemo(() => {
        return [
            t("failureReason1"),
            t("failureReason2"),
            t("failureReason3"),
            t("failureReason4"),
            t("failureReason5"),
            t("failureReason6"),
            t("failureReason7"),
            t("failureReason8"),
            t("failureReason9")
        ]
    }, [t]);

    useEffect(() => {
        document.title = hasFailed ? t("paymentFailure") : t("paymentPending");
    }, [t, hasFailed]);

    return (
        <main>
            <Stack
                className={styles.error_page_container}
                justifyContent="center"
            >
                <img
                    src={`/images/icons/${hasFailed ? "failure" : "pending"}.png`}
                    alt=""
                />

                <Stack
                    gap="4em"
                >
                    <Stack
                        className={styles.error_container}
                        gap="3em"
                    >
                        <Title
                            text={t(hasFailed ?  "paymentFailure" : "paymentPending")}
                            headingNumber={1}
                        />

                        <Stack
                            className={styles.text_container}
                            gap="2em"
                        >
                            <p>
                                {hasFailed ? t("paymentFailureAlert") : t("paymentPendingAlert")}
                            </p>

                            {hasFailed && (
                                <Stack
                                    gap="0.5em"
                                >
                                    {failureReasons.map((reason, index) => (
                                        <React.Fragment
                                            key={index}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="start"
                                                justifyContent="start"
                                                className={styles.failure_reason}
                                            >
                                                - 
    
                                                <p>
                                                    {reason}
                                                </p>
                                            </Stack>
                                        </React.Fragment>
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Stack>

                    <NonBackgroundButton
                        text={t("backToHome")}
                        handleClick={() => navigate("/")}
                        varColor="--light-theme-color"
                    />
                </Stack>
            </Stack>
        </main>
    );
}

export default PaymentFailure;
