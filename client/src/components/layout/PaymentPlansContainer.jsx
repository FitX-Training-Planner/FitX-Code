import { useTranslation } from "react-i18next";
import styles from "./TrainerPageContainers.module.css";
import Stack from "../containers/Stack";
import Title from "../text/Title";
import ClickableIcon from "../form/buttons/ClickableIcon";
import useWindowSize from "../../hooks/useWindowSize";
import PaymentPlanCard from "../cards/contracts/PaymentPlanCard";
import React from "react";
import FlexWrap from "../containers/FlexWrap";

function PaymentPlansContainer({
    paymentPlans,
    paymentPlansError,
    handleAddPaymentPlan,
    handleModifyPaymentPlan,
    handleRemovePaymentPlan,
    handlePayPaymentPlan,
    viewerIsClient
}) {
    const { t } = useTranslation();

    const { width } = useWindowSize();

    return (
        <Stack
            gap="3em"
            className={styles.payment_plans_container}
        >
            <Title
                headingNumber={2}
                text={t("paymentPlans")}
            />

            {paymentPlans.length !== 0 ? (
                <FlexWrap
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    gap="2em"
                    maxElements={width <= 940 ? 1 : 2}
                >                               
                    {paymentPlans.map((plan, index) => (
                        <React.Fragment
                            key={index}
                        >
                            <PaymentPlanCard
                                name={plan.name} 
                                fullPrice={plan.fullPrice} 
                                durationDays={plan.durationDays} 
                                description={plan.description} 
                                benefits={plan.benefits}
                                handleModifyPaymentPlan={!viewerIsClient ? () => handleModifyPaymentPlan(plan) : undefined}
                                handleRemovePaymentPlan={!viewerIsClient ? () => handleRemovePaymentPlan(plan.ID) : undefined}
                                handlePayPaymentPlan={viewerIsClient ? () => handlePayPaymentPlan(plan.ID) : undefined}
                            />
                        </React.Fragment>
                    ))}
                </FlexWrap>
            ) : (
                paymentPlansError ? (
                    <p>
                        {t("errorOcurredPaymentPlans")}

                        <br/>
                        
                        {t("reloadOrTryLater")}
                    </p>
                ) : (
                    <p>
                        {t("noTrainerPaymentPlans")}
                    </p>
                )
            )}

            {!viewerIsClient && (
                <ClickableIcon
                    iconSrc="/images/icons/add.png"
                    name={t("addPaymentPlan")}
                    handleClick={handleAddPaymentPlan}
                />
            )}
        </Stack>
    )
}

export default PaymentPlansContainer;