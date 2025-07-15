import { useState } from "react";
import convertDays from "../../../utils/formatters/text/convertDays";
import Stack from "../../containers/Stack";
import ClickableIcon from "../../form/buttons/ClickableIcon";
import PhotoInput from "../../form/fields/PhotoInput";
import styles from "./ContractCard.module.css";
import PaymentCard from "./PaymentCard";
import { formatDateToExtend } from "../../../utils/formatters/text/formatDate";
import useWindowSize from "../../../hooks/useWindowSize";

function ContractCard({
    clientName,
    clientPhoto,
    startDate,
    endDate,
    status,
    durationDays,
    paymentPlanName,
    paymentPlanID,
    paymentAmount, 
    paymentMethod, 
    paymentTransactionDate, 
    mercadoPagoTransactionId, 
    paymentReceiptUrl
}) {
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
                    {viewPayment ? "Pagamento" : formatDateToExtend(startDate)}
                </span>

                <ClickableIcon
                    iconSrc={`/images/icons/${viewPayment ? "exit" : "transaction"}.png`}
                    name={viewPayment ? "Fechar" : "Ver Pagamento"}
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
                            gap="0.5em"
                            className={styles.descriptioned_item}
                        >
                            <span>
                                Plano de Pagamento:
                            </span>

                            <Stack
                                gap="0.2em"
                            >
                                <span>
                                    {paymentPlanName}
                                </span>
                             
                                <span>
                                    ID: {paymentPlanID}
                                </span>
                            </Stack>
                        </Stack>

                        <Stack
                            gap="2em"
                            direction={width <= 640 ? "column" : "row"}
                        >
                            <Stack
                                className={styles.descriptioned_item}
                                alignItems={width <= 640 ? "center" : "start"}
                            >
                                <span>
                                    Contratante:
                                </span>

                                <Stack
                                    direction={width <= 440 ? "column" : "row"}
                                    className={styles.descriptioned_item}
                                    justifyContent={width <= 640 ? "center" : "start"}
                                >
                                    <PhotoInput
                                        blobUrl={clientPhoto}
                                        disabled
                                        size={width <= 440 ? "small" : "medium"}
                                    />

                                    <span>
                                        {clientName}
                                    </span>
                                </Stack>
                            </Stack>

                            <Stack
                                alignItems={width <= 640 ? "start" : "end"}
                            >
                                <Stack
                                    alignItems={width <= 640 ? "start" : "end"}
                                    extraStyles={{ textAlign: width <= 640 ? "start" : "end" }}
                                    gap="0.2em"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        Duração do Plano:
                                    </span>

                                    <span>
                                        {durationDays} Dias - {convertDays(durationDays)}
                                    </span>
                                </Stack>

                                <Stack
                                    alignItems={width <= 640 ? "start" : "end"}
                                    extraStyles={{ textAlign: width <= 640 ? "start" : "end" }}
                                    gap="0.2em"
                                    className={styles.descriptioned_item}
                                >
                                    <span>
                                        Término:
                                    </span>

                                    <span>
                                        {formatDateToExtend(endDate)}
                                    </span>
                                </Stack>
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
                    amount={paymentAmount} 
                    method={paymentMethod} 
                    transactionDate={paymentTransactionDate} 
                    mercadoPagoTransactionId={mercadoPagoTransactionId} 
                    receiptUrl={paymentReceiptUrl} 
                />
            )}
        </Stack>
    );
}

export default ContractCard;