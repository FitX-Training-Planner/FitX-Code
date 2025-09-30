import { useTranslation } from "react-i18next";
import { formatPriceToBR } from "../../../utils/formatters/payments/formatOnChange";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import Alert from "../../messages/Alert";
import styles from "./ContractCard.module.css";

function PaymentCard({
    amount,
    trainerReceived,
    transactionDate,
    mercadoPagoTransactionId,
    receiptUrl,
    appFee,
    mpFee,
    paymentMethod,
    width
}) {
    const { t, i18n } = useTranslation();
    
    return (
        <Stack
            className={styles.payment_card}
        >
            <Stack
                gap="2em"
                direction={width <= 640 ? "column" : "row-reverse"}
            >
                <Stack
                    className={styles.descriptioned_item}
                    alignItems={width <= 640 ? "center" : "end"}
                >
                    <span>
                        {t("transaction")}:
                    </span>

                    <Stack
                        gap="0.8em"
                        alignItems={width <= 640 ? "center" : "end"}
                    >
                        <span>
                            {formatDateToExtend(transactionDate, i18n.language)}
                        </span>

                        <Stack
                            direction="row"
                            justifyContent={width <= 640 ? "center" : "end"}
                        >
                            <span>
                                ID: {mercadoPagoTransactionId}
                            </span>

                            <Alert
                                alertMessage={t("alertTransactionId")}
                            />
                        </Stack>
                    </Stack>
                </Stack>

                <Stack>
                    <Stack
                        alignItems="start"
                    >
                        <Stack
                            gap="0.5em"
                            alignItems="start"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                {t("total")}:
                            </span>

                            <span>
                                {formatPriceToBR(amount)}
                            </span>
                        </Stack>

                        {trainerReceived && (
                            <Stack
                                gap="0.5em"
                                alignItems="start"
                                className={styles.descriptioned_item}
                            >
                                <span>
                                    {t("received")}:
                                </span>

                                <span>
                                    {formatPriceToBR(trainerReceived)}
                                </span>
                            </Stack>
                        )}
                        
                        <Stack
                            gap="0.5em"
                            alignItems="start"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                {t("fees")}:
                            </span>

                            <Stack
                                alignItems="start"
                                gap="0.2em"
                            >
                                {mpFee && (
                                    <span>
                                        Mercado Pago - {formatPriceToBR(mpFee)}
                                    </span>
                                )}
                                
                                <span>
                                    FitX - {formatPriceToBR(appFee)}
                                </span>
                            </Stack>
                        </Stack>
                    </Stack>
                    
                    <Stack
                        gap="0.5em"
                        alignItems="start"
                        className={styles.descriptioned_item}
                    >
                        <span>
                            {t("paymentMethodId")}:
                        </span>

                        <Stack
                            alignItems="start"
                        >
                            {paymentMethod}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <hr/>

            <Stack
                gap="0.2em"
                alignItems="start"
                className={styles.descriptioned_item}
            >
                <span>
                    {t("receiptUrl")}:
                </span>

                <Stack
                    direction="row"
                >
                    {receiptUrl ? (
                        <>
                            <p
                                className={styles.receipt_url}
                            >
                                {receiptUrl}
                            </p>
        
                            <ClickableIcon
                                iconSrc="/images/icons/redirect.png"
                                name={t("seeReceipt")}
                                handleClick={() => window.open(receiptUrl, "_blank", "noopener,noreferrer")}
                                size="small"
                            />
                        </>
                    ) : (
                        <>
                            <Alert/>

                            <p>
                                {t("notReceiptAlert")}
                            </p>
                        </>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
}

export default PaymentCard;