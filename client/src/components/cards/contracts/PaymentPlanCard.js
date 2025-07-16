import React from "react";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import convertDays from "../../../utils/formatters/text/convertDays";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import styles from "./PaymentPlanCard.module.css";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

function PaymentPlanCard({
    name,
    fullPrice,
    durationDays,
    description,
    benefits,
    handleModifyPaymentPlan,
    handleRemovePaymentPlan
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();
    
    return (
        <Stack
            className={styles.payment_plan_card}
        >
            {handleModifyPaymentPlan && handleRemovePaymentPlan && (
                <Stack
                    direction="row"
                    gap="0.5em"
                >
                    <ClickableIcon
                        iconSrc="/images/icons/edit.png"
                        name={t("edit")}
                        handleClick={handleModifyPaymentPlan}
                        size="small"
                    />

                    <ClickableIcon
                        iconSrc="/images/icons/remove.png"
                        name={t("remove")}
                        handleClick={handleRemovePaymentPlan}
                        size="small"
                    />
                </Stack>
            )}

            <Stack
                gap="0.2em"
                className={styles.payment_value}
                extraStyles={{ fontSize: width <= 440 ? "var(--small-title-size)" : "var(--large-title-size)" }}
            >
                <span>
                    {formatPriceToBR(fullPrice || "0,00")}
                </span>
            </Stack>

            <Stack
                gap="2em"
            >
                <Stack
                    className={styles.plan_title}
                    direction="row"
                    justifyContent="center"
                >
                    {width > 440 && (
                        <hr/>
                    )}
                    
                    <span>
                        {name}
                    </span>
                    
                    {width > 440 && (
                        <hr/>
                    )}
                </Stack>

                <Stack
                    gap="2em"
                >
                    <Stack
                        gap="0.2em"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            {t("servicesDuration")}:
                        </span>

                        <Stack
                            gap="0.2em"
                            className={styles.plan_duration}
                        >
                            <span>
                                {durationDays || 0} {t("day")}{durationDays === 1 ? "" : "s"}
                            </span>

                            {durationDays > 6 && (
                                <>
                                    {t("or")}

                                    <span>
                                        {convertDays(durationDays)}
                                    </span>
                                </>
                            )}
                        </Stack>
                    </Stack>

                    {benefits.length !== 0 && (
                        <Stack
                            className={styles.plan_benefits}
                            alignItems="start"
                            extraStyles={{ padding: width <= 440 ? "0" : "0 1em" }}
                        >
                            <span>
                                {t("benefits")}:
                            </span>

                            <Stack>
                                {benefits.map((benefit, index) => (
                                    <React.Fragment
                                        key={index}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="start"
                                            justifyContent="start"
                                        >
                                            - 

                                            <p>
                                                {benefit.description}
                                            </p>
                                        </Stack>
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </Stack>
                    )}

                    {description && (
                        <Stack
                            className={styles.payment_plan_note}
                            alignItems="start"
                            extraStyles={{ padding: width <= 440 ? "0" : "0 1em" }}
                        >
                            <span>
                                {t("description")}:
                            </span>

                            <p>
                                {description}
                            </p>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
}

export default PaymentPlanCard;