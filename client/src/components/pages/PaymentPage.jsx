import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Stack from "../containers/Stack";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PaymentPage.module.css";
import useRequest from "../../hooks/useRequest";
import api from "../../api/axios";
import Title from "../text/Title";
import { formatPriceToBR } from "../../utils/formatters/payments/formatOnChange";
import SubmitFormButton from "../form/buttons/SubmitFormButton";
import AcceptTerms from "../form/fields/AcceptTerms";
import useWindowSize from "../../hooks/useWindowSize";
import Alert from "../messages/Alert";
import FooterLayout from "../containers/FooterLayout";
import BackButton from "../layout/BackButton";

function PaymentPage() {
    const { t } = useTranslation();

    const location = useLocation();

    const navigate = useNavigate();

    const { width } = useWindowSize();

    const { request: payReq } = useRequest();

    const clientContractFeatures = useMemo(() => {
        return [
            t("clientContractFeature1"),
            t("clientContractFeature2"),
            t("clientContractFeature3"),
            t("clientContractFeature4"),
            t("clientContractFeature5"),
            t("clientContractFeature6"),
            t("clientContractFeature7"),
            t("clientContractFeature8")
        ]
    }, [t]);

    const refundTerms = useMemo(() => {
        return [
            t("refundTerm1"),
            t("refundTerm2"),
            t("refundTerm3"),
            t("refundTerm4"),
            t("refundTerm5"),
            t("refundTerm6"),
            t("refundTerm7"),
            t("refundTerm8"),
            t("refundTerm9"),
            t("refundTerm10")
        ]
    }, [t]);

    const [paymentPlan, setPaymentPlan] = useState();
    const [acceptTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        const locationPaymentPlan = location.state?.paymentPlan;

        if (!locationPaymentPlan) {
            navigate("/");
        } else {
            setPaymentPlan(locationPaymentPlan);
        }
    }, [location.state?.paymentPlan, navigate]);

    const handleOnPay = useCallback(async (e) => {
        e.preventDefault();

        if (!acceptTerms) return;

        const formData = new FormData();

        formData.append("paymentPlanId", paymentPlan?.ID)

        const pay = () => {
            return api.post(`/payment`, formData);
        }
    
        const handleOnPaySuccess = (data) => {
            window.location.href = data.init_point;
        };

        const handleOnPayError = () => {
            navigate(-1);
        };

        payReq(
            pay, 
            handleOnPaySuccess, 
            handleOnPayError, 
            undefined, 
            undefined, 
            t("errorCreatePay")
        );
    }, [acceptTerms, navigate, payReq, paymentPlan?.ID, t]);

    useEffect(() => {
        document.title = t("checkout");
    }, [t]);

    return (
        <FooterLayout>
            <main>
                <BackButton/>

                <Stack>
                    <Stack
                        className={styles.payment_page_title}
                    >
                        <Title
                            headingNumber={1}
                            text={t("checkout")}
                            varColor="--white-color"
                        />
                    </Stack>

                    <Stack
                        extraStyles={{ padding: width <= 440 ? "2em 1em" : "2em" }}
                        gap="3em"
                    >
                        <Stack
                            className={styles.about_payment_plan}
                        >
                            <Stack
                                direction={width <= 440 ? "column" : "row"}
                            >
                                <img
                                    alt=""
                                    src="/images/icons/payment_plan.png"
                                />

                                <Title
                                    headingNumber={2}
                                    text={t("paymentPlan")}
                                />

                                {width > 440 && (
                                    <img
                                        alt=""
                                        src="/images/icons/payment_plan.png"
                                    />
                                )}
                            </Stack>

                            <hr/>

                            <Stack
                                direction={width <= 440 ? "column" : "row"}
                                alignItems="start"
                            >
                                <Stack
                                    className={styles.plan_main_info}
                                    alignItems="start"
                                    gap={width <= 440 ? "2em" : "5em"}
                                >
                                    <span
                                        className={styles.plan_name}
                                    >
                                        {t("plan")} {paymentPlan?.name}
                                    </span>

                                    <Stack
                                        alignItems="start"
                                        gap="0"
                                    >
                                        <span
                                            className={styles.plan_price}
                                        >
                                            {formatPriceToBR(String(Number(paymentPlan?.fullPrice) + Number(paymentPlan?.appFee)))}
                                        </span>
                                        
                                        <span
                                            className={styles.plan_duration}
                                        >
                                            {paymentPlan?.durationDays} {t("day")}{paymentPlan?.durationDays === 1 ? "" : "s"}
                                        </span>
                                    </Stack>
                                </Stack>

                                {width <= 440 && (
                                    <hr/>
                                )}
                                

                                {(paymentPlan?.benefits.length !== 0 || paymentPlan?.description) && (
                                    <Stack
                                        gap="2em"
                                    >
                                        {paymentPlan?.benefits.length !== 0 && (
                                            <Stack>
                                                <Title
                                                    headingNumber={3}
                                                    text={t("benefits")}
                                                    varColor="--light-theme-color"
                                                />

                                                <Stack>
                                                    {paymentPlan?.benefits.map((benefit, index) => (
                                                        <React.Fragment
                                                            key={index}
                                                        >
                                                            <Stack
                                                                direction="row"
                                                                alignItems="start"
                                                                justifyContent="start"
                                                                className={styles.benefit}
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

                                        {paymentPlan?.description && (
                                            <Stack>
                                                <Title
                                                    headingNumber={3}
                                                    text={t("description")}
                                                    varColor="--light-theme-color"
                                                />

                                                <p>
                                                    {paymentPlan.description}
                                                </p>
                                            </Stack>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>

                        <Stack
                            gap="3em"
                            className={styles.about_fitx_client_container}
                        >
                            <Stack
                                className={styles.about_fitx_client}
                            >
                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                >
                                    <img
                                        alt=""
                                        src="/images/icons/contracts.png"
                                    />

                                    <Title
                                        headingNumber={2}
                                        text={t("aboutTheFitXClient")}
                                    />

                                    {width > 440 && (
                                        <img
                                            alt=""
                                            src="/images/icons/contracts.png"
                                        />
                                    )}
                                </Stack>

                                <hr/>

                                <Stack
                                    alignItems="start"
                                >
                                    {clientContractFeatures.map((feature, index) => (
                                        <p
                                            key={index}
                                        >                                       
                                            {feature}
                                        </p>
                                    ))}
                                        
                                    <p>
                                        {t("moreRefundInfo")}
                                    </p>
                                </Stack>
                            </Stack>

                            <Stack
                                className={styles.about_refund_policy}
                            >
                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                >
                                    <img
                                        alt=""
                                        src="/images/icons/refund.png"
                                    />

                                    <Title
                                        headingNumber={2}
                                        text={t("refundPolicy")}
                                    />

                                    {width > 440 && (
                                        <img
                                            alt=""
                                            src="/images/icons/refund.png"
                                        />
                                    )}
                                </Stack>

                                <hr/>

                                <Stack
                                    alignItems="start"
                                >
                                    {refundTerms.map((term, index) => (
                                        <p
                                            key={index}
                                        >
                                            {term}
                                        </p>
                                    ))}
                                </Stack>
                            </Stack>

                            <Stack>
                                <Stack
                                    className={styles.fitx_client_alert}
                                    direction="row"
                                    justifyContent="start"
                                >
                                    <Alert 
                                        varColor="--theme-color"
                                    />

                                    <p>
                                        {t("aboutTheFitXClientAlert")}
                                    </p>
                                </Stack>

                                <Stack
                                    className={styles.fitx_client_alert}
                                    direction="row"
                                    justifyContent="start"
                                >
                                    <Alert 
                                        varColor="--theme-color"
                                    />

                                    <p>
                                        {t("appDatesAlert")}
                                    </p>
                                </Stack>
                            </Stack>
                        </Stack>

                        <AcceptTerms
                            isAccepted={acceptTerms}
                            setIsAccepted={setAcceptedTerms}
                            description={t("createPaymentPlanTerms")}
                            policyDestinies={["/app/policies/refund-and-cancellation", "/app/terms-and-conditions"]}
                            policyNames={[t("refundAndCancellationPolicy"), t("refundAndCancellationPolicy")]}
                        />

                        {acceptTerms && (
                            <Stack
                                gap="4em"
                            >
                                <Title
                                    headingNumber={2}
                                    text={t("payment")}
                                />

                                <Stack
                                    gap="3em"
                                >
                                    <Stack>
                                        <Stack
                                            alignItems="start"
                                        >
                                            <span
                                                className={styles.plan_price}
                                            >
                                                {formatPriceToBR(String(Number(paymentPlan?.fullPrice) + Number(paymentPlan?.appFee)))}
                                            </span>

                                            <span>
                                                {formatPriceToBR(paymentPlan?.appFee)}
                                            </span>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            justifyContent="start"
                                        >
                                            <Alert />

                                            <p>
                                                {t("mpRedirect")}
                                            </p>
                                        </Stack>
                                    </Stack>

                                    <form
                                        onSubmit={handleOnPay}
                                        style={{ width: "max-content" }}
                                    >
                                        <SubmitFormButton
                                            text={t("pay")}
                                        />
                                    </form>
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </main>
        </FooterLayout>
    );
}

export default PaymentPage;