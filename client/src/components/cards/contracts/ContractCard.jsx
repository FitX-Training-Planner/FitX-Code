import { useMemo, useState } from "react";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./ContractCard.module.css";
import PaymentCard from "./PaymentCard";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";

function ContractCard({
    userName,
    userPhoto,
    startDate,
    endDate,
    status,
    canceledOrRescindedDate,
    paymentPlanName,
    transactionAmount, 
    transactionAppFee, 
    transactionMpFee, 
    transactionTrainerReceived, 
    paymentMethod, 
    transactionDate, 
    mercadoPagoTransactionId, 
    transactionReceiptUrl,
    forClient,
    hasOtherInLine = false
}) {
    const { t, i18n } = useTranslation();

    const { width } = useWindowSize();

    const [viewPayment, setViewPayment] = useState(false);

    const calculatedWidth = useMemo(() => {
        if (hasOtherInLine) return (width / 2);

        return width;
    }, [hasOtherInLine, width]);

    return (
        <Stack
            className={styles.contract_card}
            gap="0.5em"
        >
            <Stack
                direction="row"
                className={`${styles.descriptioned_item} ${styles.payment_button_container}`}
            >
                <span>
                    {viewPayment ? t("payment") : formatDateToExtend(startDate, i18n.language)}
                </span>

                <ClickableIcon
                    iconSrc={`/images/icons/${viewPayment ? "exit" : "transaction"}.png`}
                    name={viewPayment ? t("close") : t("seePayment")}
                    handleClick={() => setViewPayment(prevViewPayment => !prevViewPayment)}
                />
            </Stack>

            {!viewPayment ? (
                <Stack
                    gap="0.5em"
                >
                    <Stack
                        className={styles.contract_info}
                        gap="2em"
                    >
                        <Stack
                            gap={calculatedWidth <= 840 && calculatedWidth > 640 ? "0.5em" : "2em"}
                            direction={calculatedWidth <= 840 ? "column" : "row"}
                        >
                            <Stack
                                direction={calculatedWidth <= 640 ? "column" : "row"}
                                gap="2em"
                                extraStyles={{ width: calculatedWidth <= 840 ? "100%" : "calc(200% + 2em)" }}
                            >
                                <Stack
                                    className={styles.descriptioned_item}
                                    alignItems={calculatedWidth <= 640 ? "center" : "start"}
                                >
                                    <span>
                                        {forClient ? t("contracted") : t("contractor")}:
                                    </span>

                                    <Stack
                                        direction={calculatedWidth <= 440 ? "column" : "row"}
                                        className={styles.descriptioned_item}
                                        justifyContent={calculatedWidth <= 640 ? "center" : "start"}
                                        extraStyles={{ textAlign: "center" }}
                                    >
                                        {userName ? (
                                            <>
                                                <PhotoInput
                                                    blobUrl={userPhoto}
                                                    disabled
                                                    size={calculatedWidth <= 840 ? "small" : "small"}
                                                />

                                                <span>
                                                    {userName}
                                                </span>
                                            </>
                                        ) : (
                                            <p>
                                                {t("deletedUser")}
                                            </p>
                                        )}
                                    </Stack>
                                </Stack>

                                <Stack>
                                    <Stack
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                    >
                                        <span>
                                            {t("value")}:
                                        </span>

                                        <span>
                                            {formatPriceToBR(transactionAmount)}
                                        </span>
                                    </Stack>

                                    <Stack
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                        extraStyles={{ textAlign: "center" }}
                                    >
                                        <span>
                                            {t("paymentPlan")}:
                                        </span>

                                        {paymentPlanName ? (
                                            <span>
                                                {paymentPlanName}
                                            </span>
                                        ) : (
                                            <p>
                                                {t("deletedPaymentPlanAlert")}
                                            </p>
                                        )}
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Stack
                                alignItems={calculatedWidth <= 640 ? "start" : "end"}
                                gap={calculatedWidth <= 840 ? "0.5em" : "1em"}
                            >
                                <Stack
                                    alignItems={calculatedWidth <= 640 ? "start" : "end"}
                                    extraStyles={{ textAlign: calculatedWidth <= 640 ? "start" : "end" }}
                                    gap="0.5em"
                                    className={styles.descriptioned_item}
                                    direction={calculatedWidth <= 840 && calculatedWidth > 340 ? "row" : "column"}
                                    justifyContent={calculatedWidth <= 840 ? "start" : undefined}
                                >
                                    <span>
                                        {t("end")}:
                                    </span>

                                    <span>
                                        {formatDateToExtend(endDate, i18n.language)}
                                    </span>
                                </Stack>

                                {canceledOrRescindedDate && (
                                    <Stack
                                        alignItems={calculatedWidth <= 640 ? "start" : "end"}
                                        extraStyles={{ textAlign: calculatedWidth <= 640 ? "start" : "end" }}
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
                                        direction={calculatedWidth <= 840 && calculatedWidth > 340 ? "row" : "column"}
                                        justifyContent={calculatedWidth <= 840 ? "start" : undefined}
                                    >
                                        <span>
                                            {status}:
                                        </span>

                                        <span>
                                            {formatDateToExtend(canceledOrRescindedDate, i18n.language)}
                                        </span>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack
                        direction="row"
                        className={`${styles.descriptioned_item} ${styles.status_container}`}
                    >
                        <span>
                            {status}
                        </span>
                    </Stack>
                </Stack>
            ) : (
                <PaymentCard
                    amount={transactionAmount} 
                    transactionDate={transactionDate} 
                    mercadoPagoTransactionId={mercadoPagoTransactionId} 
                    receiptUrl={transactionReceiptUrl} 
                    appFee={transactionAppFee}
                    mpFee={transactionMpFee}
                    paymentMethod={paymentMethod}
                    trainerReceived={transactionTrainerReceived}
                    width={calculatedWidth}
                />
            )}
        </Stack>
    );
}

export default ContractCard;