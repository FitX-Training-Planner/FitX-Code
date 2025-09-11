import { useState } from "react";
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
    forClient
}) {
    const { t, i18n } = useTranslation();

    const { width } = useWindowSize();

    const [viewPayment, setViewPayment] = useState(false);

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
                            gap="2em"
                            direction={width <= 640 ? "column" : "row"}
                        >
                            <Stack
                                className={styles.descriptioned_item}
                                alignItems={width <= 640 ? "center" : "start"}
                            >
                                <span>
                                    {forClient ? t("contracted") : t("contractor")}:
                                </span>

                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                    className={styles.descriptioned_item}
                                    justifyContent={width <= 640 ? "center" : "start"}
                                    extraStyles={{ textAlign: "center" }}
                                >
                                    {userName ? (
                                        <>
                                            <PhotoInput
                                                blobUrl={userPhoto}
                                                disabled
                                                size={width <= 840 ? "small" : "medium"}
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

                            <Stack
                                alignItems={width <= 640 ? "start" : "end"}
                            >
                                <Stack
                                    alignItems={width <= 640 ? "start" : "end"}
                                    extraStyles={{ textAlign: width <= 640 ? "start" : "end" }}
                                    gap="0.5em"
                                    className={styles.descriptioned_item}
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
                                        alignItems={width <= 640 ? "start" : "end"}
                                        extraStyles={{ textAlign: width <= 640 ? "start" : "end" }}
                                        gap="0.5em"
                                        className={styles.descriptioned_item}
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
                />
            )}
        </Stack>
    );
}

export default ContractCard;